from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # 환경 변수에서 설정 로드
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['GOOGLE_MAPS_API_KEY'] = os.getenv('GOOGLE_MAPS_API_KEY')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
    
    # SQLAlchemy 초기화
    db.init_app(app)
    
    # 데이터베이스 테이블 생성
    with app.app_context():
        from .models import RecommendedPlace
        db.create_all()
    
    # 블루프린트 등록
    from backend.app.routes import chatbot_bp
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    
    return app

# app 객체 생성
app = create_app() 