from flask import Blueprint, request, jsonify, session
from app.services.location import validate_location
from app.services.google_maps_api import GoogleMapsAPI
from app.utils.parser import parse_request
from app.models import db, RecommendedPlace
import uuid
import concurrent.futures

chatbot_bp = Blueprint('chatbot', __name__)

# 메모리 기반 세션 저장소
user_sessions = {}

def make_gmaps_directions_url(origin_lat, origin_lng, dest_lat, dest_lng, mode="transit"):
    return (
        f"https://www.google.com/maps/dir/?api=1"
        f"&origin={origin_lat},{origin_lng}"
        f"&destination={dest_lat},{dest_lng}"
        f"&travelmode={mode}"
    )

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    user_input = data.get('user_input', '')

    # 자연어 파싱
    parsed = parse_request(data)
    categories = parsed["search_keywords"]
    radius = parsed.get("radius", 2000)
    sort_by = parsed.get("sort_by", "rating")

    # 위치 검증
    if not (latitude and longitude and validate_location(latitude, longitude)):
        return jsonify({'error': '위치 정보가 올바르지 않습니다.'}), 400

    if not categories:
        return jsonify({'error': '추천받고 싶은 카테고리를 입력하세요.'}), 400

    # Google Maps 장소 검색
    google_api = GoogleMapsAPI()
    recommendations = []

    def get_transit_info(google_api, latitude, longitude, dest_lat, dest_lng):
        origin = f"{latitude},{longitude}"
        destination = f"{dest_lat},{dest_lng}"
        transit = google_api.get_directions(origin, destination, mode="transit")
        if (
            transit
            and transit.get('routes')
            and transit['routes']
            and transit['routes'][0].get('legs')
            and transit['routes'][0]['legs']
        ):
            transit_time = transit['routes'][0]['legs'][0]['duration']['text']
            distance_val = transit['routes'][0]['legs'][0]['distance']['value']
            return transit_time, distance_val
        return None, None

    user_id = request.headers.get('X-USER-ID', str(uuid.uuid4()))  # 사용자 식별자

    for category in categories:
        places_json = google_api.search_places(category, latitude, longitude, radius=radius)
        items = places_json.get('results', [])

        # 이미 추천한 place_id 목록 조회
        prev_place_ids = {r.place_id for r in RecommendedPlace.query.filter_by(user_id=user_id).all()}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_item = {}
            for item in items:
                place_id = item.get('place_id')
                if place_id in prev_place_ids:
                    continue  # 이미 추천한 장소는 제외

                # 목적지 좌표 추출
                dest_lat = None
                dest_lng = None
                if 'geometry' in item and 'location' in item['geometry']:
                    dest_lat = item['geometry']['location'].get('lat')
                    dest_lng = item['geometry']['location'].get('lng')

                if dest_lat is not None and dest_lng is not None:
                    future = executor.submit(get_transit_info, google_api, latitude, longitude, dest_lat, dest_lng)
                    future_to_item[future] = (item, category, dest_lat, dest_lng, place_id)
            for future in concurrent.futures.as_completed(future_to_item):
                item, category, dest_lat, dest_lng, place_id = future_to_item[future]
                transit_time, distance_val = future.result()

                # ★ 여기서 rating을 다시 추출
                rating = item.get('rating')

                directions_url = make_gmaps_directions_url(latitude, longitude, dest_lat, dest_lng, mode="transit")

                recommendation = {
                    'category': category,
                    'title': item.get('name', ''),
                    'address': item.get('vicinity', ''),
                    'rating': rating if rating is not None else 0,
                    'transit_time': transit_time,
                    'distance': distance_val if distance_val is not None else 9999999,
                    'directions_url': directions_url
                }
                recommendations.append(recommendation)

                # 추천한 장소 DB에 저장
                db.session.add(RecommendedPlace(user_id=user_id, place_id=place_id))
            db.session.commit()

    # 정렬 기준에 따라 정렬
    if sort_by == 'distance':
        recommendations.sort(key=lambda x: x.get('distance', 9999999))
    # elif sort_by == 'user_ratings_total':
    #     recommendations.sort(key=lambda x: x.get('user_ratings_total', 0), reverse=True)
    else:  # 기본값: 평점순
        recommendations.sort(key=lambda x: x.get('rating') or 0, reverse=True)

    # 추천 결과 생성 후, 반경 내 결과만 필터링
    recommendations = [rec for rec in recommendations if rec['distance'] <= radius]

    # 위에서 제시한 코드로 추천 및 DB 저장/중복 제외 처리

    return jsonify({
        'recommendations': recommendations[:5]  # 상위 5개만 반환
    })

@chatbot_bp.route('/session', methods=['GET'])
def get_session():
    user_id = request.args.get('user_id')
    if not user_id or user_id not in user_sessions:
        return jsonify({'error': '세션 없음'}), 404
    return jsonify({'recommendations': user_sessions[user_id]})

@chatbot_bp.route('/session/reset', methods=['POST'])
def reset_session():
    user_id = request.json.get('user_id')
    if user_id in user_sessions:
        del user_sessions[user_id]
    return jsonify({'message': '세션 초기화 완료'})