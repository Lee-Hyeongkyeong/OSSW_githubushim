# routes.py

from flask import Blueprint, request, jsonify, session
from app.services.location import validate_location
from app.services.google_maps_api import GoogleMapsAPI
from app.utils.parser import parse_request
from app.models import db, RecommendedPlace
import uuid
import concurrent.futures
import time
import math
from functools import lru_cache
from sqlalchemy import func

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

# 메모리 기반으로 사용자별 최근 요청 정보 저장
user_last_requests = {}
user_sessions = {}  # 사용자 세션 정보 저장

# 캐시 크기 설정
CACHE_SIZE = 100

def make_gmaps_directions_url(origin_lat, origin_lng, dest_lat, dest_lng, mode="transit"):
    return (
        f"https://www.google.com/maps/dir/?api=1"
        f"&origin={origin_lat},{origin_lng}"
        f"&destination={dest_lat},{dest_lng}"
        f"&travelmode={mode}"
    )

@lru_cache(maxsize=CACHE_SIZE)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # 지구 반지름 (m)
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@lru_cache(maxsize=CACHE_SIZE)
def get_transit_info(google_api, origin, destination):
    transit = google_api.get_directions(origin, destination, mode="transit")
    transit_time = None
    if (transit and transit.get('routes') and 
        transit['routes'] and transit['routes'][0].get('legs')):
        transit_time = transit['routes'][0]['legs'][0]['duration']['text']
    return transit_time

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    user_input = data.get('user_input', '')
    is_more_request = False
    display_message = data.get('display_message', user_input)

    user_id = request.headers.get('X-USER-ID', str(uuid.uuid4()))
    
    # 이전 요청 정보 가져오기
    last_request = user_last_requests.get(user_id, {})
    
    # 자연어 파싱 (이전 요청 정보 전달)
    data['last_request'] = last_request
    parsed = parse_request(data)
    categories = parsed["search_keywords"]
    radius = parsed.get("radius", 2000)
    sort_by = parsed.get("sort_by", "rating")
    is_more_request = parsed["is_more_request"]

    # 위치 검증
    if not (latitude and longitude and validate_location(latitude, longitude)):
        return jsonify({'error': '위치 정보가 올바르지 않습니다.'}), 400

    if not categories:
        return jsonify({'error': '추천받고 싶은 카테고리를 입력하세요.'}), 400

    # 새로운 요청이면 DB 초기화
    if not is_more_request:
        RecommendedPlace.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        
        # 현재 요청 정보 저장
        user_last_requests[user_id] = {
            'latitude': latitude,
            'longitude': longitude,
            'radius': radius,
            'categories': categories,
            'sort_by': sort_by
        }

    # Google Maps 장소 검색
    google_api = GoogleMapsAPI()
    all_recommendations = []

    # 이미 추천한 place_id 목록을 한 번에 조회
    # 올바른 문자열 집합 생성
    prev_place_ids = {
        pid for (pid,) in 
        db.session.query(RecommendedPlace.place_id)
          .filter(RecommendedPlace.user_id == user_id)
          .all()
    }
    seen_ids = set(prev_place_ids)

    # 검색 시작 알림
    search_status = {
        'is_searching': True,
        'message': '장소를 탐색하고 있습니다.'
    }

    for category in categories:
        next_page_token = None
        max_pages = 6
        for _ in range(max_pages):
            places_json = google_api.search_places(
                category,
                latitude,
                longitude,
                radius=radius,
                page_token=next_page_token
            )
            items = places_json.get('results', [])
            if not items:
                break
                
            print(f"Searching for category: {category}")
            print(f"With radius: {radius}")
            print(f"Places found: {len(items)}")
            
            # 거리순으로 정렬된 결과를 반경 내 장소만 필터링
            filtered_items = []
            for item in items:
                if 'geometry' in item and 'location' in item['geometry']:
                    dest_lat = item['geometry']['location'].get('lat')
                    dest_lng = item['geometry']['location'].get('lng')
                    if dest_lat is not None and dest_lng is not None:
                        distance_val = haversine(float(latitude), float(longitude), dest_lat, dest_lng)
                        if distance_val <= radius:
                            filtered_items.append((item, distance_val))
                        else:
                            break
            
            # 1) 거리순으로 정렬된 후보 중 상위 5개만 선택
            filtered_items.sort(key=lambda x: x[1])  # x = (item, distance)
            top5 = filtered_items[:5]

            # 2) 그 5개에 대해서만 길찾기 API 호출
            recommendations = []
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                futures = []
                for item, distance_val in top5:
                    place_id = item.get('place_id')
                    # 이전 호출이나 이번 호출에 이미 담겼으면 건너뛴다
                    if place_id in seen_ids:
                        continue
                    dest_lat = item['geometry']['location']['lat']
                    dest_lng = item['geometry']['location']['lng']
                    origin = f"{latitude},{longitude}"
                    destination = f"{dest_lat},{dest_lng}"
                    futures.append((executor.submit(get_transit_info, google_api, origin, destination),
                                    item, distance_val, dest_lat, dest_lng))

                for future, item, distance_val, dest_lat, dest_lng in futures:
                    try:
                        transit_time = future.result()
                        # recommendation 생성 & DB 저장
                        rating = item.get('rating', 0)
                        rec = {
                            'category': category,
                            'title': item.get('name', ''),
                            'address': item.get('vicinity', ''),
                            'rating': '-' if rating == 0 else rating,
                            'distance': int(distance_val),
                            'transit_time': transit_time,
                            'directions_url': make_gmaps_directions_url(
                                latitude, longitude, dest_lat, dest_lng, mode="transit"
                            ),
                            'place_id': item.get('place_id')
                        }
                        recommendations.append(rec)
                        db.session.add(RecommendedPlace(user_id=user_id, place_id=item.get('place_id')))
                        seen_ids.add(item.get('place_id'))
                    except Exception as e:
                        print(f"Error processing place: {e}")
            
            db.session.commit()
            all_recommendations.extend(recommendations)

            next_page_token = places_json.get('next_page_token')
        if not next_page_token:
            break
        # 짧게만 대기하거나 제거
        # time.sleep(0.5)

    # 정렬 기준에 따라 정렬
    if sort_by == 'distance':
        all_recommendations.sort(key=lambda x: x.get('distance', 9999999))
    else:  # 기본값: 평점순
        all_recommendations.sort(key=lambda x: x.get('rating', 0) if x.get('rating') != '-' else 0, reverse=True)

    if is_more_request:
        # 이미 보낸 개수만큼 offset
        offset = len(prev_place_ids)
        result = all_recommendations[offset : offset + 5]
    else:
        # 첫 호출일 땐 처음 5개
        result = all_recommendations[:5]

    # 검색 완료 상태로 변경
    search_status['is_searching'] = False
    search_status['message'] = '검색이 완료되었습니다.'

    return jsonify({
        'recommendations': result,
        'last_request': user_last_requests.get(user_id, {}),
        'display_message': display_message,
        'search_status': search_status
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

@chatbot_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': 'chatbot-api',
        'timestamp': int(time.time() * 1000)
    })

@app.route("/")
def index():
    # 간단히 헬스체크나 문서 페이지로 리다이렉트
    return "Chatbot API is running.", 200
