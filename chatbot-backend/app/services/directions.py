# directions.py: Google Maps API를 사용하여 경로 정보를 제공하는 서비스 모듈

from flask import jsonify
import requests
from config import GOOGLE_MAPS_API_KEY

def get_directions(origin, destination):
    """
    두 지점 간의 경로 정보를 가져오는 함수
    
    Args:
        origin (str): 출발지 주소 또는 좌표
        destination (str): 목적지 주소 또는 좌표
    
    Returns:
        dict: 경로 정보를 포함한 응답
    """
    try:
        # Google Maps Directions API 엔드포인트
        url = f"https://maps.googleapis.com/maps/api/directions/json"
        
        # API 요청 파라미터 설정
        params = {
            "origin": origin,
            "destination": destination,
            "key": GOOGLE_MAPS_API_KEY,
            "mode": "transit",  # 대중교통 모드로 설정
            "language": "ko"    # 한국어로 결과 반환
        }
        
        # API 요청 보내기
        response = requests.get(url, params=params)
        data = response.json()
        
        # 응답 상태 확인
        if data["status"] == "OK":
            # 첫 번째 경로 정보 추출
            route = data["routes"][0]
            leg = route["legs"][0]
            
            # 경로 정보 정리
            directions_info = {
                "distance": leg["distance"]["text"],      # 거리
                "duration": leg["duration"]["text"],      # 소요 시간
                "start_address": leg["start_address"],    # 출발지 주소
                "end_address": leg["end_address"],        # 목적지 주소
                "steps": []                               # 상세 경로 단계
            }
            
            # 각 경로 단계 정보 추출
            for step in leg["steps"]:
                directions_info["steps"].append({
                    "instruction": step["html_instructions"],  # 경로 안내
                    "distance": step["distance"]["text"],     # 구간 거리
                    "duration": step["duration"]["text"]      # 구간 소요 시간
                })
            
            return jsonify({
                "status": "success",
                "data": directions_info
            })
        else:
            # API 오류 발생 시
            return jsonify({
                "status": "error",
                "message": f"경로를 찾을 수 없습니다: {data['status']}"
            }), 404
            
    except Exception as e:
        # 예외 발생 시
        return jsonify({
            "status": "error",
            "message": f"경로 정보를 가져오는 중 오류가 발생했습니다: {str(e)}"
        }), 500