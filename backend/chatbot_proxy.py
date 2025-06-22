# backend/chatbot_proxy.py
import os
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin

# 환경변수로 변경 가능, 기본값은 https 챗봇 URL
CHATBOT_URL = os.getenv("CHATBOT_URL", "https://trippick-chatbot.onrender.com")

proxy_bp = Blueprint("chatbot_proxy", __name__)

# 클라이언트에서 오는 모든 메서드에 대해 CORS 허용 설정
@proxy_bp.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
@cross_origin(origins=["https://trippick.vercel.app"], supports_credentials=True)
def proxy(path):
    """
    클라이언트 → 프론트 Static/Vercel Edge → Render 프록시 → 이 프록시 → 챗봇 서비스
    """
    url = f"{CHATBOT_URL}/api/chatbot/{path}"
    try:
        # 원본 요청 헤더 중 Host만 제외하고 복사
        headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

        resp = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            params=request.args,
            json=request.get_json(silent=True),
            timeout=20
        )

        # hop-by-hop 헤더 제거 (Transfer-Encoding 등)
        hop_by_hop = {
            'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
            'te', 'trailer', 'transfer-encoding', 'upgrade'
        }
        filtered_headers = [
            (k, v) for k, v in resp.headers.items()
            if k.lower() not in hop_by_hop
        ]

        return (resp.content, resp.status_code, filtered_headers)
    except requests.RequestException as e:
        current_app.logger.error(f"[Chatbot Proxy] {e}")
        return jsonify({"error": "Chatbot server unreachable"}), 502
