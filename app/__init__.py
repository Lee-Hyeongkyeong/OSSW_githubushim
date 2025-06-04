import os
from flask import Flask
from .models import db

def create_app():
    app = Flask(__name__)

    # 환경 변수에서 DB URL 읽어와서 SQLAlchemy에 설정
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///chatbot.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Google Maps API 키 설정
    app.config['GOOGLE_MAPS_API_KEY'] = os.getenv("GOOGLE_MAPS_API_KEY")

    db.init_app(app)

    from .routes import chatbot_bp
    app.register_blueprint(chatbot_bp)

    return app