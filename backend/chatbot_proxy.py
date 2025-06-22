# backend/chatbot_proxy.py
import os
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin

# 환경변수로 변경 가능, 기본값은 8000번 포트
CHATBOT_URL = os.getenv("CHATBOT_URL", "https://trippick-chatbot.onrender.com")

proxy_bp = Blueprint("chatbot_proxy", __name__)

@proxy_bp.route("/<path:path>", methods=["GET","POST","PUT","DELETE","OPTIONS"])
@cross_origin()    # 이미 전역 CORS 설정했다면 생략 가능
def proxy(path):
    """
    클라이언트 → 메인 HTTPS 서버 → 이 프록시 → 챗봇 HTTP 서버
    """
    url = f"{CHATBOT_URL}/api/chatbot/{path}"
    try:
        # 원본 요청 헤더 중 Host만 빼고 그대로 넘기기
        headers = {k: v for k, v in request.headers if k.lower() != "host"}
        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            params=request.args,
            json=request.get_json(silent=True),
            timeout=20
        )
        return (resp.content, resp.status_code, resp.headers.items())
    except requests.RequestException as e:
        current_app.logger.error(f"[Chatbot Proxy] {e}")
        return jsonify({"error":"Chatbot server unreachable"}), 502
