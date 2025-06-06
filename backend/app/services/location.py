# location.py: 사용자의 현재 위치 정보를 가져오는 모듈

import requests

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

def validate_location(latitude, longitude):
    try:
        lat = float(latitude)
        lng = float(longitude)
        return -90 <= lat <= 90 and -180 <= lng <= 180
    except (ValueError, TypeError):
        return False 