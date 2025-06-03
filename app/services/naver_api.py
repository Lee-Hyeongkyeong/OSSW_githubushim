from flask import current_app
import requests

class NaverAPI:
    def __init__(self):
        self.client_id = current_app.config['NAVER_CLIENT_ID']
        self.client_secret = current_app.config['NAVER_CLIENT_SECRET']
        self.base_url = "https://openapi.naver.com/v1/search/local.json"

    def search_places(self, query, latitude, longitude, radius=2000):  # 반경 2km
        headers = {
            'X-Naver-Client-Id': self.client_id,
            'X-Naver-Client-Secret': self.client_secret
        }
        
        params = {
            'query': query,
            'display': 5,
            'sort': 'random',
            'coordinate': f"{longitude},{latitude}",
            'radius': radius
        }
        
        print(f"Naver Search API Request:")
        print(f"URL: {self.base_url}")
        print(f"Headers: {headers}")
        print(f"Params: {params}")
        
        response = requests.get(self.base_url, headers=headers, params=params)
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Content: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            # 거리 필터링 추가
            filtered_items = []
            for item in data.get('items', []):
                try:
                    item_lat = float(item.get('mapy', 0)) / 10000000
                    item_lon = float(item.get('mapx', 0)) / 10000000
                    
                    from math import radians, sin, cos, sqrt, atan2
                    
                    def haversine(lat1, lon1, lat2, lon2):
                        R = 6371
                        dlat = radians(lat2 - lat1)
                        dlon = radians(lon2 - lon1)
                        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
                        c = 2 * atan2(sqrt(a), sqrt(1-a))
                        return R * c * 1000
                    
                    distance = haversine(latitude, longitude, item_lat, item_lon)
                    if distance <= radius:
                        item['distance'] = distance
                        filtered_items.append(item)
                except Exception as e:
                    print(f"Error processing item: {e}")
                    continue
            
            print(f"Filtered items count: {len(filtered_items)}")
            return {'items': filtered_items}
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return {'items': []}