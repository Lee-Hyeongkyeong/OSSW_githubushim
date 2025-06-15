import os
import json
import pytest
from flask import Flask
from flask_login import LoginManager
from click.testing import CliRunner

# 블루프린트 import
from backend.survey.survey import survey_bp
from backend.recommend.city_routes import city_recommend_bp
from backend.recommend.content_routes import content_recommend_bp
from backend.recommend.detail_routes import detail_recommend_bp

# 더미 사용자
class DummyUser:
    id = 1
    is_authenticated = True

@pytest.fixture
def app(tmp_path, monkeypatch):
    # ——— Flask 앱 생성 ———
    app = Flask(__name__)
    app.config['TESTING'] = True

    # ——— LoginManager 설정 (login_required 우회) ———
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager._login_disabled = True

    # current_user를 더미로 패치
    monkeypatch.setattr('backend.survey.survey.current_user', DummyUser)

    # survey 모듈의 PROFILES_DIR를 tmp_path로 변경
    monkeypatch.setattr('backend.survey.survey.PROFILES_DIR', str(tmp_path / "profiles"))

    # ——— 블루프린트 등록 ———
    app.register_blueprint(survey_bp, url_prefix='/survey')
    app.register_blueprint(city_recommend_bp)
    app.register_blueprint(content_recommend_bp)
    app.register_blueprint(detail_recommend_bp)

    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_full_api_flow(client, monkeypatch):
    # 1) /survey/history (처음엔 파일 없음)
    resp = client.get('/survey/history')
    assert resp.status_code == 200
    assert resp.get_json() == {"hasHistory": False}

    # 2) /survey/ 잘못된 Content-Type
    resp = client.post('/survey/', data="{}", content_type="text/plain")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Content-Type must be application/json"

    # 3) /survey/ 빈 JSON 바디
    resp = client.post('/survey/', json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Invalid data format"

    # 4) /survey/ 정상 설문 제출
    sample = {
        "travel_style_1": "맛집탐방형",
        "priorities": ["음식점", "액티비티"],
        "travel_style_2": "관광형",
        "places": ["바다"],
        "purposes": ["힐링"],
        "must_go": ["스테디셀러"]
    }
    # compute_user_tag_scores 실제 구현이 무겁다면 여기서도 모의할 수 있지만, 
    # 인티그레이션 레벨에서는 그대로 실행해 봅니다.
    resp = client.post('/survey/', json=sample)
    assert resp.status_code == 200
    payload = resp.get_json()
    assert payload["status"] == "success"
    assert "data" in payload

    # 5) /survey/history (이제 파일이 생겼으므로 True)
    resp = client.get('/survey/history')
    assert resp.status_code == 200
    assert resp.get_json() == {"hasHistory": True}

    # 6) /api/recommend/cities
    #    recommend_cities 내부 로직이 복잡하면 모의하지만, 여기서는 가볍게 모의
    monkeypatch.setattr(
        'backend.recommend.city_routes.recommend_cities',
        lambda scores, top_n: [("테스트도시", 9.9)]
    )
    resp = client.post('/api/recommend/cities', json={"top_n": 1})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "추천 완료"
    assert data["total_requested"] == 1
    assert data["recommendations"] == [{"city": "테스트도시", "score": 9.9}]

    # 7) /api/recommend/contents
    monkeypatch.setattr('backend.recommend.content_routes.load_user_tags', lambda: ["맛집"])
    monkeypatch.setattr('backend.recommend.content_routes.load_city_contents', lambda city: [{"id": 42}])
    monkeypatch.setattr(
        'backend.recommend.content_routes.recommend_grouped_contents',
        lambda contents, tags: {"group1": [{"id": 42}], "group2": [], "group3": []}
    )
    resp = client.get('/api/recommend/contents?city=서울')
    assert resp.status_code == 200
    result = resp.get_json()
    assert result == {"group1": [{"id": 42}], "group2": [], "group3": []}

    # 8) /api/recommend/details
    monkeypatch.setattr('backend.recommend.detail_routes.load_user_tags', lambda: ["역사"])
    monkeypatch.setattr('backend.recommend.detail_routes.load_city_contents', lambda city: [{"id": 99}])
    monkeypatch.setattr(
        'backend.recommend.detail_routes.recommend_grouped_detail',
        lambda contents, tags: {
            "group1": [{"id": 99}], "group2": [], "group3": [], "group4": [], "group5": []
        }
    )
    resp = client.get('/api/recommend/details?city=부산')
    assert resp.status_code == 200
    result = resp.get_json()
    assert result["group1"] == [{"id": 99}]
    assert set(result.keys()) == {"group1","group2","group3","group4","group5"}
