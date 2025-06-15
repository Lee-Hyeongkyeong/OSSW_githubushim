import pytest
from flask import Flask
import backend.recommend.detail_routes as routes_mod

@pytest.fixture
def app(monkeypatch):
    # 1) Flask 앱 생성 및 테스트 모드 설정
    app = Flask(__name__)
    app.config['TESTING'] = True

    # 2) 라우트가 의존하는 함수들에 fake 구현 주입
    #    - load_user_tags: 임의의 태그 리스트 리턴
    monkeypatch.setattr(routes_mod, 'load_user_tags', lambda: ['tagX', 'tagY'])
    #    - load_city_contents: 호출된 city를 캡처해서 리턴
    captured = {}
    def fake_load_city_contents(city):
        captured['city'] = city
        return [{'id': 1}, {'id': 2}]
    monkeypatch.setattr(routes_mod, 'load_city_contents', fake_load_city_contents)
    #    - recommend_grouped_detail: 더미 그룹 결과
    dummy_groups = {
        'group1': list(range(10)),
        'group2': list(range(5)),
        'group3': [],
        'group4': list(range(3)),
        'group5': list(range(7)),
    }
    monkeypatch.setattr(routes_mod,
                        'recommend_grouped_detail',
                        lambda contents, tags: dummy_groups)

    # 3) Blueprint 등록
    app.register_blueprint(routes_mod.detail_recommend_bp)
    # attach captured for access in tests
    app.captured = captured
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_recommendations_detail_default_city(client, app):
    # city 파라미터 없이 호출하면 default "서울" 사용
    resp = client.get('/api/recommend/details')
    assert resp.status_code == 200

    data = resp.get_json()
    # 5개 그룹 키 확인
    assert set(data.keys()) == {'group1','group2','group3','group4','group5'}
    # 각각 최대 100개까지 slice → dummy_groups에 충분히 작으므로 원본 길이 그대로
    assert data['group1'] == list(range(10))
    assert data['group2'] == list(range(5))
    assert data['group3'] == []
    assert data['group4'] == list(range(3))
    assert data['group5'] == list(range(7))

    # load_city_contents가 "서울"로 호출됐는지 확인
    assert app.captured.get('city') == '서울'

def test_get_recommendations_detail_with_city_param(client, app):
    # 다른 city 쿼리 파라미터 전달
    resp = client.get('/api/recommend/details?city=부산')
    assert resp.status_code == 200

    # load_city_contents가 "부산"으로 호출됐는지 확인
    assert app.captured.get('city') == '부산'

    # JSON 응답 구조는 동일
    data = resp.get_json()
    assert set(data.keys()) == {'group1','group2','group3','group4','group5'}
