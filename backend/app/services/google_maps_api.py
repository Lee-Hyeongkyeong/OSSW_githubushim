from flask import current_app
import requests
from requests.exceptions import RequestException

class GoogleMapsAPI:
    def __init__(self):
        self.api_key = current_app.config['GOOGLE_MAPS_API_KEY']
        self.timeout = 5  # 기본 타임아웃 5초

    def _make_request(self, url, params):
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            print(f"API Request Error: {str(e)}")
            return {"results": []} if "nearbysearch" in url else {}

    def search_places(self, query, latitude, longitude, radius=2000, page_token=None):
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
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "key": self.api_key,
            "place_id": place_id,
            "language": "ko"
        }
        return self._make_request(url, params)

    def get_directions(self, origin, destination, mode="driving"):
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "key": self.api_key,
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "language": "ko"
        }
        return self._make_request(url, params) 