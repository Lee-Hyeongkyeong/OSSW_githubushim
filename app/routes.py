from flask import Blueprint, request, jsonify, session
from app.services.location import validate_location
from app.services.google_maps_api import GoogleMapsAPI
from app.utils.parser import parse_request
import uuid

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

    # 거리 한도와 정렬 기준 파라미터 받기 (기본값: 2000m, 평점순)
    radius = int(data.get('radius', 2000))
    sort_by = data.get('sort_by', 'rating')  # 'rating', 'distance', 'user_ratings_total' 등

    # 위치 검증
    if not (latitude and longitude and validate_location(latitude, longitude)):
        return jsonify({'error': '위치 정보가 올바르지 않습니다.'}), 400

    # 카테고리 추출
    parsed = parse_request(data)
    categories = parsed["search_keywords"]
    if not categories:
        return jsonify({'error': '추천받고 싶은 카테고리를 입력하세요.'}), 400

    # Google Maps 장소 검색
    google_api = GoogleMapsAPI()
    recommendations = []

    for category in categories:
        places_json = google_api.search_places(category, latitude, longitude, radius=radius)
        items = places_json.get('results', [])
        for item in items:
            # 평점과 리뷰 수를 Nearby Search 결과에서 우선 추출
            rating = item.get('rating')
            user_ratings_total = item.get('user_ratings_total')
            # 상세 정보에서 추가 정보 보완 (필요시)
            details = google_api.get_place_details(item['place_id'])
            result = details.get('result', {})
            # 상세 정보에 평점이 있으면 덮어쓰기(없으면 기존 값 유지)
            if result.get('rating') is not None:
                rating = result.get('rating')
            if result.get('user_ratings_total') is not None:
                user_ratings_total = result.get('user_ratings_total')

            # 목적지 좌표 추출
            dest_lat = None
            dest_lng = None
            if 'geometry' in item and 'location' in item['geometry']:
                dest_lat = item['geometry']['location'].get('lat')
                dest_lng = item['geometry']['location'].get('lng')

            # 이동 시간 계산 (대중교통만)
            transit_time = None
            distance_val = None
            directions_url = None
            if dest_lat is not None and dest_lng is not None:
                origin = f"{latitude},{longitude}"
                destination = f"{dest_lat},{dest_lng}"

                # 대중교통
                transit = google_api.get_directions(origin, destination, mode="transit")
                if (
                    transit
                    and transit.get('routes')
                    and transit['routes']
                    and transit['routes'][0].get('legs')
                    and transit['routes'][0]['legs']
                ):
                    transit_time = transit['routes'][0]['legs'][0]['duration']['text']
                    distance_val = transit['routes'][0]['legs'][0]['distance']['value']  # 미터 단위

                # 길찾기 URL 생성
                directions_url = make_gmaps_directions_url(latitude, longitude, dest_lat, dest_lng, mode="transit")

            recommendation = {
                'category': category,
                'title': item.get('name', ''),
                'address': item.get('vicinity', ''),
                'rating': rating if rating is not None else 0,
                'user_ratings_total': user_ratings_total if user_ratings_total is not None else 0,
                'transit_time': transit_time,
                'distance': distance_val if distance_val is not None else 9999999,  # 미터
                'directions_url': directions_url
            }
            recommendations.append(recommendation)

    # 정렬 기준에 따라 정렬
    if sort_by == 'distance':
        recommendations.sort(key=lambda x: x.get('distance', 9999999))
    elif sort_by == 'user_ratings_total':
        recommendations.sort(key=lambda x: x.get('user_ratings_total', 0), reverse=True)
    else:  # 기본값: 평점순
        recommendations.sort(key=lambda x: x.get('rating') or 0, reverse=True)

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