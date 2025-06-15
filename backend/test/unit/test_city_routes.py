import os
import json
import pytest
from flask import Flask
from flask_login import LoginManager
from backend.recommend.city_routes import city_recommend_bp
from backend.survey.city_recommend import recommend_cities as real_recommend_cities

# 더미 유저 클래스
class DummyUser:
    def __init__(self, user_id, authenticated=True):
        self.id = user_id
        self.is_authenticated = authenticated

@pytest.fixture
def app(tmp_path, monkeypatch):
    # 1) Flask 앱과 LoginManager 설정
    app = Flask(__name__)
    app.config['TESTING'] = True

    login_manager = LoginManager()
    login_manager.init_app(app)

    # 2) 더미 유저 준비 및 current_user 패치
    dummy = DummyUser(user_id=123)
    monkeypatch.setattr(
        'backend.recommend.city_routes.current_user',
        dummy
    )

    # 3) 프로필 디렉토리·파일 준비 (기본 프로필)
    import backend.recommend.city_routes as routes_mod
    base_dir       = os.path.dirname(routes_mod.__file__)
    profiles_dir   = os.path.abspath(os.path.join(base_dir, "..", "user_profiles"))
    default_file   = os.path.abspath(os.path.join(base_dir, "user_profile.json"))
    os.makedirs(profiles_dir, exist_ok=True)
    # 기본 프로필 쓰기
    default_profile = {"weights": {"tagA": 1}}
    with open(default_file, "w", encoding="utf-8") as f:
        json.dump(default_profile, f, ensure_ascii=False)

    # 4) Blueprint 등록
    app.register_blueprint(city_recommend_bp)

    # 5) user_loader (필요는 없지만, LoginManager가 없으면 login_required가 작동하지 않음)
    @login_manager.user_loader
    def load_user(user_id):
        return dummy if int(user_id) == 123 else None

    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_recommend_for_user_success(monkeypatch, client):
    # 추천 로직을 모의(mock)하여 반환값 고정
    fake_result = [("서울특별시", 5.0), ("부산광역시", 3.2)]
    monkeypatch.setattr(
        'backend.recommend.city_routes.recommend_cities',
        lambda scores, top_n: fake_result
    )

    # 요청 보내기
    resp = client.post(
