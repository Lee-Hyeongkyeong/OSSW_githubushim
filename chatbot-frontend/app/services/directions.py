from flask import current_app
import requests

def get_directions(start_coords, end_coords, mode='driving'):
    # Convert NAVER coordinates to WGS84
    start_lon, start_lat = start_coords
    end_lon = float(end_coords[0]) / 10000000
    end_lat = float(end_coords[1]) / 10000000
    
    # Get base URL from config
    base_url = current_app.config['NAVER_MAPS_URL']
    
    # Construct full URL based on mode
    if mode == 'driving':
        url = f"{base_url}/driving"
        option = "trafast"
    else:  # Default to walking
        url = f"{base_url}/walking"
        option = "walkfast"

    headers = {
        "X-NCP-APIGW-API-KEY-ID": current_app.config['NAVER_MAPS_CLIENT_ID'],
        "X-NCP-APIGW-API-KEY": current_app.config['NAVER_MAPS_CLIENT_SECRET']
    }
    
    params = {
        "start": f"{start_lon},{start_lat}",
        "goal": f"{end_lon},{end_lat}",
        "option": option
    }

    print(f"Requesting directions API: {url}")
    print(f"With params: {params}")
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            return parse_directions_response(response.json(), mode)
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Request Error: {str(e)}")
        return None

def parse_directions_response(data, mode):
    try:
        if mode == 'driving':
            return data['route']['trafast'][0]['summary']['duration'] // 1000
        else:
            return data['route']['walkfast'][0]['summary']['duration'] // 1000
    except Exception as e:
        print(f"Parse Error: {str(e)}")
        return None