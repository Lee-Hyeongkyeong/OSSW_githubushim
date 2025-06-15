import pytest
from flask import Flask
import backend.recommend.content_routes as routes_mod

@pytest.fixture
def app(monkeypatch):
    # 1) Flask 앱 생성 및 테스트 모드 설정
    app = Flask(__name__)
    app.config['TESTING'] = True

    # 2) 라우트가 의존하는 함수들에 fake 구현 주입
    #    - load_user_tags: 아무 값이나 리턴
    monkeypatch.setattr(routes_mod, 'load_user_tags', lambda: ['tagA'])
    #    - load_city_contents: 더미 콘텐츠 리스트 리턴
    monkeypatch.setattr(routes_mod, 'load_city_contents', lambda city: [{'foo': 'bar'}])
    #    - recommend_grouped_contents: 그룹별 더미 결과
    monkeypatch.setattr(
        routes_mod,
        'recommend_grouped_contents',
        lambda contents, tags: {
            'group1': [{'id': 1}, {'id': 2}, {'id': 3}, {'id': 4}, {'id': 5}],
            'group2': [{'id': 'a'}],
            'group3': []
        }
    )

    # 3) Blueprint 등록
    app.register_blueprint(routes_mod.content_recommend_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_recommendations_default_city(client):
    # 기본(city 파라미터 없이) 요청
    resp = client.get('/api/recommend/contents')
    assert resp.status_code == 200

    data = resp.get_json()
    # 세 그룹이 모두 반환되어야 함
    assert set(data.keys()) == {'group1', 'group2', 'group3'}

    # group1은 5개 중 상위 4개만 잘 잘려서 리턴
    assert len(data['group1']) == 4
    assert data['group1'] == [{'id': 1}, {'id': 2}, {'id': 3}, {'id': 4}]

    # group2는 원래 1개만 있으므로 그대로
    assert data['group2'] == [{'id': 'a'}]
    # group3는 빈 리스트
    assert data['group3'] == []

def test_get_recommendations_with_city_param(monkeypatch, client):
    # city 파라미터가 잘 전달되는지 확인하기 위해 load_city_contents를 캡처하도록 교체
    captured = {}
    def fake_load_city_contents(city):
        captured['city'] = city
        return []
    monkeypatch.setattr(routes_mod, 'load_city_contents', fake_load_city_contents)

    # 나머지 두 함수도 최소한 동작하도록 패치
    monkeypatch.setattr(routes_mod, 'load_user_tags', lambda: [])
    monkeypatch.setattr(
        routes_mod,
        'recommend_grouped_contents',
        lambda contents, tags: {'group1': [], 'group2': [], 'group3': []}
    )

    resp = client.get('/api/recommend/contents?city=부산')
    assert resp.status_code == 200

    # load_city_contents가 "부산"으로 호출되었는지 확인
    assert captured.get('city') == '부산'

    # 응답 JSON도 빈 그룹 3개여야 함
    assert resp.get_json() == {'group1': [], 'group2': [], 'group3': []}
