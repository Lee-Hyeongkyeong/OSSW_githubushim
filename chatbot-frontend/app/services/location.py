from flask import request, jsonify
import requests

def get_user_location():
    if 'latitude' in request.args and 'longitude' in request.args:
        latitude = request.args['latitude']
        longitude = request.args['longitude']
        return latitude, longitude
    else:
        return None, None

def validate_location(latitude, longitude):
    try:
        lat = float(latitude)
        lon = float(longitude)
        return -90 <= lat <= 90 and -180 <= lon <= 180
    except Exception:
        return False

def get_location_data(latitude, longitude):
    # Placeholder for future implementation to fetch location data
    return {
        "latitude": latitude,
        "longitude": longitude,
        "message": "Location data retrieved successfully."
    }