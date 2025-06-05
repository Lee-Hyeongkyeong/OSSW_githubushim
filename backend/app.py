# Python standard libraries
import json
import os
import sqlite3

from backend.survey.survey    import survey_bp
from backend.survey.city_recommend     import recommend_cities 
from backend.survey.content_recommend  import recommend_contents  
#필요시 API 추가
#from googleLogin.views import google_bp 
#from user             import user_bp

from flask import Flask, redirect, request, url_for, jsonify
from flask_cors import CORS 
from pathlib import Path
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests

from backend.googleLogin.db import init_db_command
from backend.googleLogin.user import User

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
CORS(app, resources={r"/api/*": {"origins": "https://localhost:3001"}}, supports_credentials=True)
CORS(survey_bp, supports_credentials=True, origins=["https://localhost:3001"])
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE="None",
)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

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
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri="https://127.0.0.1:5000/login/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


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
        redirect_url="https://127.0.0.1:5000/login/callback",
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


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

from flask import jsonify, request

@app.route("/api/recommend/cities", methods=["POST"])
@login_required              # 설문 저장이 로그인 이후라면 로그인 필요
def api_recommend_cities():
    """
    body : { "top_n": 3 }
    반환 : { "recommendations": [ {city:"서울특별시", score:123}, … ] }
    """
    body   = request.get_json(silent=True) or {}
    top_n  = int(body.get("top_n", 3))

    # ① 사용자 프로필에서 '가중치가 있는 태그'만 추출
    prof_path = Path(__file__).resolve().parent / "survey" / "user_profile.json"
    if not prof_path.exists():
        return jsonify({"error": "user_profile.json not found"}), 400

    prof          = json.loads(prof_path.read_text(encoding="utf-8"))
    user_tag_list = [t for t in prof.get("weights", {}) if t != "필터"]

    # ② 추천 실행
    result = recommend_cities(user_tag_list, top_n)
    return jsonify({"recommendations": result})

@app.route("/api/recommend/contents", methods=["POST"])
@login_required
def api_recommend_contents():
    """
    body : { "city": "서울특별시", "top_n": 5 }
    반환 : { "contents": [ {...콘텐츠객체}, … ] }
    """
    body   = request.get_json(silent=True) or {}
    city   = body.get("city")
    top_n  = int(body.get("top_n", 5))
    if not city:
        return jsonify({"error": "city is required"}), 400

    # 사용자 태그 (필터 제외) 로드
    prof_path = Path(__file__).resolve().parent / "survey" / "user_profile.json"
    if not prof_path.exists():
        return jsonify({"error": "user_profile.json not found"}), 400
    prof      = json.loads(prof_path.read_text("utf-8"))
    user_tags = [t for t in prof.get("weights", {}) if t != "필터"]

    # 추천 실행
    contents = recommend_contents(city, user_tags, top_n)
    return jsonify({"contents": contents})

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed = ['https://localhost:3001']
    if origin in allowed:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

if __name__ == "__main__":
    app.run(ssl_context="adhoc")
