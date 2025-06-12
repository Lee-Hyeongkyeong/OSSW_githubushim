"""
Google Maps API 연동 서비스 모듈
- 장소 검색
- 장소 상세 정보 조회
- 길찾기 정보 조회
"""

from flask import current_app
import requests
from requests.exceptions import RequestException

class GoogleMapsAPI:
    """
    Google Maps API 연동을 위한 클래스
    - Places API: 장소 검색 및 상세 정보
    - Directions API: 길찾기 정보
    """
    def __init__(self):
        self.api_key = current_app.config['GOOGLE_MAPS_API_KEY']
        self.timeout = 5  # 기본 타임아웃 5초

    def _make_request(self, url, params):
        """
        API 요청을 보내고 응답을 처리하는 내부 메서드
        - 에러 처리 및 타임아웃 설정
        - JSON 응답 반환
        """
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            print(f"API Request Error: {str(e)}")
            return {"results": []} if "nearbysearch" in url else {}

    def search_places(self, query, latitude, longitude, radius=2000, page_token=None):
        """
        주변 장소 검색
        - 거리순 정렬
        - 페이지네이션 지원
        - 한국어로 결과 반환
        """
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "key": self.api_key,
            "location": f"{latitude},{longitude}",
            "rankby": "distance",  # 거리순 정렬
            "keyword": query,  
            "language": "ko"
        }
        if page_token:
            params["pagetoken"] = page_token
            
        return self._make_request(url, params)

    def get_place_details(self, place_id):
        """
        장소 상세 정보 조회
        - place_id로 특정 장소의 상세 정보 조회
        - 한국어로 결과 반환
        """
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "key": self.api_key,
            "place_id": place_id,
            "language": "ko"
        }
        return self._make_request(url, params)

    def get_directions(self, origin, destination, mode="transit"):
        """
        길찾기 정보 조회
        - 출발지와 목적지 사이의 경로 정보
        - 이동 수단 지정 가능 (기본값: 대중교통)
        - 한국어로 결과 반환
        """
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "key": self.api_key,
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "language": "ko"
        }
        return self._make_request(url, params)
            