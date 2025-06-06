"""
위치 관련 서비스 모듈
- 위치 정보 검증
- 위치 데이터 처리
"""

from flask import request, jsonify
import requests

def get_user_location():
    """
    요청에서 사용자 위치 정보 추출
    - URL 파라미터에서 위도/경도 추출
    - 위치 정보가 없으면 None 반환
    """
    if 'latitude' in request.args and 'longitude' in request.args:
        latitude = request.args['latitude']
        longitude = request.args['longitude']
        return latitude, longitude
    else:
        return None, None

def validate_location(latitude, longitude):
    """
    위치 정보 유효성 검증
    - 위도: -90 ~ 90
    - 경도: -180 ~ 180
    - 숫자 형식 검증
    """
    try:
        lat = float(latitude)
        lon = float(longitude)
        return -90 <= lat <= 90 and -180 <= lon <= 180
    except Exception:
        return False

def get_location_data(latitude, longitude):
    """
    위치 데이터 포맷팅
    - 위도/경도 정보를 표준 형식으로 반환
    """
    return {
        "latitude": latitude,
        "longitude": longitude,
        "message": "Location data retrieved successfully."
    }

# location.py: 사용자의 현재 위치 정보를 가져오는 서비스 모듈

def get_current_location():
    """
    사용자의 현재 위치 정보를 가져오는 함수.
    IP 기반으로 대략적인 위치 정보를 반환합니다.
    """
    try:
        # IP 기반 위치 정보를 가져오기 위한 API 요청
        response = requests.get('https://ipapi.co/json/')
        data = response.json()
        
        # 위도와 경도 정보 반환
        return {
            'latitude': data['latitude'],
            'longitude': data['longitude']
        }
    except Exception as e:
        # 오류 발생 시 None 반환
        print(f"위치 정보를 가져오는 중 오류 발생: {e}")
        return None