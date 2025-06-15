import pytest
import json
from app import app, current_user, login_manager
from flask import url_for

# --- 더미 사용자 정의 ----------------------------------
class Anonymous:
    is_authenticated = False

class AuthUser:
    is_authenticated = True
    name = "Alice"
    email = "alice@example.com"
    profile_pic = "alice.png"

# --- 공통 피처 ---------------------------------------
@pytest.fixture(autouse=True)
def disable_login_checks(monkeypatch):
    # login_required 데코레이터 무시
    login_manager._login_disabled = True

@pytest.fixture
def anon_client(monkeypatch):
    # current_user를 익명 사용자로 교체
    monkeypatch.setattr("app.current_user", Anonymous)
    return app.test_client()

@pytest.fixture
def auth_client(monkeypatch):
    # current_user를 인증된 사용자로 교체
    monkeypatch.setattr("app.current_user", AuthUser)
    return app.test_client()

# --- 테스트 케이스 ------------------------------------

def test_index_redirects_when_anonymous(anon_client):
    resp = anon_client.get("/")
    assert resp.status_code == 302
    # 로그인 페이지로 리다이렉트
    assert resp.headers["Location"].endswith("/login")

def test_index_shows_profile_when_authenticated(auth_client):
    resp = auth_client.get("/")
    assert resp.status_code == 200
    # 응답 HTML 안에 사용자 이름이 포함되어야 함
    assert b"Alice" in resp.data
    assert b"alice@example.com" in resp.data

def test_auth_check_endpoint(anon_client, auth_client):
    # 익명
    resp = anon_client.get("/api/auth/check")
    assert resp.status_code == 200
    assert resp.get_json() == {"loggedIn": False}

    # 인증된 사용자
    resp = auth_client.get("/api/auth/check")
    assert resp.status_code == 200
    assert resp.get_json() == {
        "loggedIn": True,
        "user": {
            "name": "Alice",
            "email": "alice@example.com",
            "profile_pic": "alice.png"
        }
    }

def test_userinfo_endpoint(anon_client, auth_client):
    # 익명 접근 → 401
    resp = anon_client.get("/api/userinfo")
    assert resp.status_code == 401
    assert resp.get_json() == {"error": "Unauthorized"}

    # 인증된 사용자
    resp = auth_client.get("/api/userinfo")
    assert resp.status_code == 200
    assert resp.get_json() == {"name": "Alice"}

def test_test_endpoint(anon_client):
    # 인증 여부 상관없이 항상 동작
    resp = anon_client.get("/test")
    assert resp.status_code == 200
    assert resp.get_json() == {"message": "Test successful"}

def test_logout_clears_cookies(anon_client):
    resp = anon_client.get("/logout")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["status"] == "success"
    assert data["message"] == "Logged out successfully"

    # Set-Cookie 헤더가 session, remember_token 모두 포함하는지 확인
    cookies = resp.headers.getlist("Set-Cookie")
    assert any(cookie.startswith("session=") for cookie in cookies)
    assert any("remember_token=" in cookie for cookie in cookies)

def test_login_redirects_to_google(anon_client):
    # get_google_provider_cfg를 실제 호출하지 않도록 패치
    import app as main_app
    main_app.get_google_provider_cfg = lambda: {
        "authorization_endpoint": "https://example.com/auth"
    }

    resp = anon_client.get("/login")
    assert resp.status_code in (302, 303)
    assert resp.headers["Location"].startswith("https://example.com/auth")

