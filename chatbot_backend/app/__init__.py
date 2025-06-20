"""
__init__.py
"""

import os
from flask import Flask
from flask_cors import CORS
from .models import db
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

def create_app():
    """
    Flask 애플리케이션 팩토리 함수
    - 앱 설정
    - 데이터베이스 초기화
    - CORS 설정
    - 라우트 등록
    """
    app = Flask(__name__)

    # 환경 변수에서 DB URL 읽어와서 SQLAlchemy에 설정
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///chatbot.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Google Maps API 키 설정
    app.config['GOOGLE_MAPS_API_KEY'] = os.getenv("GOOGLE_MAPS_API_KEY")

    # 데이터베이스 및 CORS 초기화
    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()

    # 라우트 블루프린트 등록
    from .routes import chatbot_bp
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    @app.route("/")
    def index():
        return "Chatbot API is running.", 200

    return app
