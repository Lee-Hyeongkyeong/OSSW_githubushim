"""
models.py
"""

from flask_sqlalchemy import SQLAlchemy

# SQLAlchemy 인스턴스 생성
db = SQLAlchemy()

class RecommendedPlace(db.Model):
    """
    추천된 장소를 기록하는 모델
    - 사용자별로 이미 추천된 장소를 추적
    - 중복 추천 방지에 사용
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(128), nullable=False)  # 사용자 식별자
    place_id = db.Column(db.String(128), nullable=False)  # Google Places API의 place_id