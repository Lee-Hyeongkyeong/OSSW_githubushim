# Python standard libraries
import json
import os
import sqlite3
import requests

from backend.survey.survey    import survey_bp
#필요시 API 추가
#from googleLogin.views import google_bp 
#from user             import user_bp

from flask import Flask, redirect, request, url_for, jsonify
from flask_cors import CORS
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests

from backend.googleLogin.db import init_db_command, get_db
from backend.googleLogin.user import User
from backend.survey.city_recommend import recommend_cities, city_tag_data

import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일 읽어오기

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Third party libraries
# Internal imports
# Configuration

GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Flask app setup
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

# ─── 세션 쿠키를 cross-site 요청에서도 전송되도록 만들기 ────────────
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True 

# ── CORS 설정 (프론트가 React 개발 서버에서 호출할 때 필요) ────────────────
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# User session management setup
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.unauthorized_handler
def unauthorized():
    return "You must be logged in to access this content.", 403


# Naive database setup DB 초기화
try:
    init_db_command()
except sqlite3.OperationalError:
    # Assume it's already been created
    pass

# OAuth2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)


# Flask-Login helper to retrieve a user from our db
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Blueprint 등록
#app.register_blueprint(user_bp,   url_prefix="/api/user")
app.register_blueprint(survey_bp, url_prefix="/api/survey")
#app.register_blueprint(google_bp, url_prefix="/api/auth")


@app.route("/")
def index():
    if current_user.is_authenticated:
        return (
            "<p>{}님 어서오세요!! 로그인 되었습니다.! 당신의 이메일 : {}</p>"
            "<div><p>당신의 구글 프로필 사진 : </p>"
            '<img src="{}" alt="Google profile pic"></img></div>'
            '<a class="button" href="/logout">로그아웃하기</a>'.format(
                current_user.name, current_user.email, current_user.profile_pic
            )
        )
    else:
        return '<a class="button" href="/login">클릭해서 구글 로그인하기</a>'


@app.route("/login")
def login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@app.route("/api/userinfo", methods=["GET"])
def userinfo():
    if current_user.is_authenticated:
        return jsonify({
            "name": current_user.name
        })
    else:
        return jsonify({"error": "Unauthorized"}), 401

@app.route("/login/callback")
def callback():
    # Get authorization code Google sent back to you
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that we have tokens (yay) let's find and hit URL
    # from Google that gives you user's profile information,
    # including their Google Profile Image and Email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # We want to make sure their email is verified.
    # The user authenticated with Google, authorized our
    # app, and now we've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Create a user in our db with the information provided
    # by Google
    user = User(
        id_=unique_id, name=users_name, email=users_email, profile_pic=picture
    )

    # Doesn't exist? Add to database
    if not User.get(unique_id):
        User.create(unique_id, users_name, users_email, picture)

    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    return redirect(url_for("index"))

@app.route("/api/recommend/cities", methods=["POST"])
@login_required
def recommend_for_user():
    """
    클라이언트 예시:
      POST /api/recommend/cities
      Authorization: Bearer <토큰>
      Content-Type: application/json

      {
        "top_n": 3
      }

    서버 동작:
      1) body에서 top_n만 읽기
      2) user_profile.json에서 태그 점수( weights )를 읽어서 user_tag_scores로 사용
      3) recommend_cities(user_tag_scores, top_n) 호출
      4) 튜플 리스트 → JSON용 딕셔너리 리스트 포맷 → 응답
    """

    # 1) 요청 body에서 top_n만 꺼낸다 (기본값: 3)
    body = request.get_json(force=True)
    top_n = body.get("top_n", 3)

    # 2) DB 대신 JSON 파일에서 user_tag_scores 읽어오기
    base_dir = os.path.dirname(__file__)               # backend 폴더 경로
    json_path = os.path.join(base_dir, "survey", "user_profile.json")
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            profile = json.load(f)
            user_tag_scores = profile.get("weights", {})
    except FileNotFoundError:
        # 파일이 없으면 빈 dict로 처리
        user_profile = {}

    # 3) 추천 로직 호출 (city_tag_data는 모듈 로드 시 이미 계산됨)
    recs_tuples = recommend_cities(user_tag_scores, top_n)
    # 예시 반환: [("서울특별시", 320), ("부산광역시", 287), …]

    # 4) 튜플 리스트를 JSON 직렬화 가능한 딕셔너리 리스트로 변환
    formatted = [{"city": city, "score": score} for city, score in recs_tuples]

    # 5) 응답 반환
    return jsonify({
        "message": "추천 완료",
        "total_requested": top_n,
        "recommendations": formatted
    })
''' #DB 이용 전달 방식
    # 2) 현재 로그인된 사용자의 태그 점수를 DB에서 가져온다
    user_id = current_user.id
    db = get_db()  # sqlite3 연결 객체 (예시)
    cursor = db.execute(
        "SELECT tag, score FROM user_tag WHERE user_id = ?", (user_id,)
    )
    rows = cursor.fetchall()
    # 예: rows = [("여행", 5), ("맛집", 3), ("쇼핑", 2)]
    user_tag_scores = { tag: score for (tag, score) in rows }

    # 만약 해당 사용자가 아직 태그 정보가 하나도 없다면, 기본값으로 빈 dict
    if not user_tag_scores:
        user_tag_scores = {}

    # 3) 추천 로직 호출
    recs_tuples = recommend_cities(user_tag_scores, city_tag_data, top_n)
    # 예시 반환: [("서울특별시", 320), ("부산광역시", 287), …]

    # 4) 튜플 리스트를 JSON 직렬화 가능한 딕셔너리 리스트로 바꾼다
    formatted = [{"city": city, "score": score} for city, score in recs_tuples]

    # 5) 최종 응답
    return jsonify({
        "message": "추천 완료",
        "total_requested": top_n,
        "recommendations": formatted
    })
'''

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


if __name__ == "__main__":
    app.run(ssl_context="adhoc")
