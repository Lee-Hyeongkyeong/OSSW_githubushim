from flask import current_app
import requests

class GoogleMapsAPI:
    def __init__(self):
        self.api_key = current_app.config['GOOGLE_MAPS_API_KEY']

    def search_places(self, query, latitude, longitude, radius=2000):
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "key": self.api_key,
            "location": f"{latitude},{longitude}",
            "radius": radius,
            "keyword": query,  
            "language": "ko"
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Google Places API Error: {response.status_code} - {response.text}")
            return {"results": []}

    def get_place_details(self, place_id):
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "key": self.api_key,
            "language": "ko"
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Google Place Details API Error: {response.status_code} - {response.text}")
            return {}

    def get_directions(self, origin, destination, mode="driving"):
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "key": self.api_key,
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "language": "ko"
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Google Directions API Error: {response.status_code} - {response.text}")
            return {}