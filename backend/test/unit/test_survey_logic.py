import os
import json
import pytest
from flask import Flask
from flask_login import LoginManager
import backend.survey.survey as survey_mod


class DummyUser:
    def __init__(self, user_id):
        self.id = user_id
        self.is_authenticated = True


@pytest.fixture
def app(tmp_path, monkeypatch):
    # 1) user_profiles 디렉토리 경로를 테스트용 임시 디렉토리로 덮어쓰기
    profiles_dir = tmp_path / "profiles"
    profiles_dir.mkdir()
    monkeypatch.setattr(survey_mod, "PROFILES_DIR", str(profiles_dir))
    # 프로필 경로 계산 함수도 이 값을 쓰므로 따로 패치 불필요

    # 2) Flask 앱과 LoginManager 설정 (login_required 우회)
    app = Flask(__name__)
    app.config["TESTING"] = True
    login_manager = LoginManager()
    login_manager.init_app(app)
    # login_required 데코레이터를 비활성화
    login_manager._login_disabled = True

    # 3) Blueprint 등록
    app.register_blueprint(survey_mod.survey_bp, url_prefix="/survey")

    # 4) current_user 패치
    dummy = DummyUser(99)
    monkeypatch.setattr(survey_mod, "current_user", dummy)

    return app


@pytest.fixture
def client(app):
    return app.test_client()


def test_compute_user_tag_scores_various_categories():
    answers = {
        "travel_style_1": "휴식형",
        "priorities": ["음식점", "액티비티", "관광지"],
        "travel_style_2": "관광형",
        "places": ["자연"],
        "purposes": ["힐링", "탐험"],
        "must_go": ["트렌디"]
    }
    weights, filters = survey_mod.compute_user_tag_scores(answers)

    # 필터 태그 확인
    assert filters == ["트렌디"]

    # 주요 태그별 점수 예상치
    # Style1 휴식형: 힐링+30, 자연+30
    # Priority: 음식점→맛집+15; 액티비티→액티비티+10, 가족+10; 관광지→문화/역사/도심/사진명소/이색 +5 each
    # Style2 관광형: 문화/역사/도심 +30 each
    # Places ["자연"]: 자연 +18
    # Purposes ["힐링","탐험":자연]: 힐링+8, 자연+8
    expected = {
        "힐링": 30 + 8,
        "자연": 30 + 18 + 8,
        "맛집": 15,
        "액티비티": 10,
        "가족": 10,
        "문화": 5 + 30,
        "역사": 5 + 30,
        "도심": 5 + 30,
        "사진명소": 5,
        "이색": 5,
    }
    # 정확히 일치하는 키·값 확인
    for tag, score in expected.items():
        assert weights[tag] == score

    # 총합 점수 검증
    assert sum(weights.values()) == sum(expected.values())


def test_submit_survey_and_history(client, tmp_path, monkeypatch):
    # 경로 계산 함수로 user_file 경로 얻기
    user_file = survey_mod.profile_path_for(99)

    # 1) 처음 history 체크 → 파일 없음
    resp = client.get("/survey/history")
    assert resp.status_code == 200
    assert resp.get_json() == {"hasHistory": False}

    # 2) 잘못된 Content-Type
    resp = client.post("/survey/", data="not json", content_type="text/plain")
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Content-Type must be application/json"

    # 3) 빈 JSON 바디
    resp = client.post("/survey/", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Invalid data format"

    # 4) 정상적인 설문 제출
    survey_data = {
        "travel_style_1": "맛집탐방형",
        "priorities": ["음식점"],
        "travel_style_2": "쇼핑형",
        "places": ["도심", "바다"],
        "purposes": ["지식 쌓기"],
        "must_go": ["홍대병 스팟"]
    }
    resp = client.post("/survey/", json=survey_data)
    assert resp.status_code == 200

    payload = resp.get_json()
    assert payload["status"] == "success"
    assert payload["message"] == "설문 저장 완료"
    assert "data" in payload

    # 5) 파일이 제대로 만들어졌는지 확인
    assert os.path.isfile(user_file)
    with open(user_file, encoding="utf-8") as f:
        saved = json.load(f)

    # saved 데이터와 응답 data 일치 확인
    assert saved == payload["data"]
    # survey_data가 저장된 부분에 travel_style 필드가 남지 않는지(원본 키와 일치)
    assert saved["survey_data"] == payload["data"]["survey_data"]

    # 6) 이후 history 체크 → 파일 있음
    resp = client.get("/survey/history")
    assert resp.status_code == 200
    assert resp.get_json() == {"hasHistory": True}
