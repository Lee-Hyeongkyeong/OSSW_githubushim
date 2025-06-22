# Python standard libraries
import json 
import os
import sqlite3
from datetime import timedelta

from backend.survey.survey    import survey_bp
from backend.recommend.city_routes    import city_recommend_bp
from backend.recommend.content_routes    import content_recommend_bp
from backend.recommend.detail_routes    import detail_recommend_bp
from backend.chatbot_proxy import proxy_bp

#필요시 API 추가
#from googleLogin.views import google_bp 
#from user             import user_bp

from flask import Flask, redirect, request, url_for, render_template, jsonify, session
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_talisman import Talisman
from flask_login import (
    LoginManager,
    current_user,
        login_required,
        login_user,
        logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests
from flask_cors import CORS

# Flask app setup
app = Flask(__name__)

# 배포 중 http 통신 문제 해결 시도
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_for=1)

@app.before_request
def set_scheme_from_cf_visitor():
    cf_visitor = request.headers.get("CF-Visitor")
    if cf_visitor:
        try:
            scheme = json.loads(cf_visitor).get("scheme")
            if scheme in ("http", "https"):
                request.environ['wsgi.url_scheme'] = scheme
        except Exception:
            pass
            

# Talisman(app, force_https=True)

app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
CORS(
    app,
    resources={r"/*": {"origins": ["https://trippick.vercel.app"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

from backend.googleLogin.db import init_db_command, get_db
from backend.googleLogin.user import User

import os
from dotenv import load_dotenv

load_dotenv() # .env 파일 읽어오기

BASE_URL = os.getenv("BASE_URL")
REDIRECT_URI = os.getenv("REDIRECT_URI")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Third party libraries
# Internal imports
# Configuration

GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)


# ─── 세션 쿠키를 cross-site 요청에서도 전송되도록 만들기 ────────────
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True 

# # 변경 전
# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.session_protection = 'strong'

# User session management setup
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = 'strong'
login_manager.refresh_view = 'login'  # Add this to redirect to login when session expires
login_manager.needs_refresh_message = "Please log in again to access this page."
login_manager.needs_refresh_message_category = "info"

# # 변경 전
# app.config.update(
#     SESSION_COOKIE_SECURE=True,
#     SESSION_COOKIE_HTTPONLY=True,
#     SESSION_COOKIE_SAMESITE='None',
#     SESSION_COOKIE_DOMAIN=None,
#     PERMANENT_SESSION_LIFETIME=timedelta(days=7),
#     SESSION_COOKIE_PATH='/',
# )
# Configure session cookie settings
app.config.update(
    SESSION_COOKIE_SECURE=True,  # Keep True for HTTPS
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='None',  # Changed from 'Lax' to 'None' for cross-origin
    SESSION_COOKIE_DOMAIN=None,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    SESSION_COOKIE_PATH='/',
    SESSION_REFRESH_EACH_REQUEST=True,  # Add this to refresh session on each request
    REMEMBER_COOKIE_DURATION=timedelta(days=7),  # Add this to set remember cookie duration
    REMEMBER_COOKIE_SECURE=True,  # Add this to make remember cookie secure
    REMEMBER_COOKIE_HTTPONLY=True,  # Add this to make remember cookie httpOnly
    REMEMBER_COOKIE_SAMESITE='None',  # Add this to make remember cookie work with cross-origin
    REMEMBER_COOKIE_DOMAIN=None,  # Add this to ensure remember cookie uses same domain
    REMEMBER_COOKIE_PATH='/',      # Add this to ensure remember cookie uses same path
)

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "You must be logged in to access this content."}), 403

@app.after_request
def after_request(response):
    # Remove duplicate headers
    if 'Access-Control-Allow-Origin' in response.headers:
        del response.headers['Access-Control-Allow-Origin']
    
    response.headers['Access-Control-Allow-Origin'] = 'https://trippick.vercel.app'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept,X-User-Id'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie,Content-Type,Authorization'
    return response


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
    print(f"Loading user with ID: {user_id}")  # Debug log
    user = User.get(user_id)
    print(f"Loaded user: {user}")  # Debug log
    return user

# Blueprint 등록
#app.register_blueprint(user_bp,   url_prefix="/api/user")
app.register_blueprint(survey_bp, url_prefix="/api/survey")
#app.register_blueprint(google_bp, url_prefix="/api/auth")
app.register_blueprint(content_recommend_bp)
app.register_blueprint(city_recommend_bp)
app.register_blueprint(detail_recommend_bp)
app.register_blueprint(proxy_bp, url_prefix="/api/chatbot")


# 환경변수에서 프론트엔드 URL 가져오기
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://trippick.vercel.app")

@app.route("/")
def index():
    if current_user.is_authenticated:
        return render_template(
            'success.html',
            name=current_user.name,
            email=current_user.email,
            profile_pic=current_user.profile_pic,
            frontend_url=FRONTEND_URL
        )
    else:
        return redirect(url_for("login"))

@app.route("/api/auth/check")
def auth_check():
    print("Checking authentication status...")  # Debug log
    print("Session data:", dict(session))  # Debug log
    print("Current user:", current_user)  # Debug log
    print("Session cookie:", request.cookies.get('session'))  # Debug log
    print("All cookies:", request.cookies)  # Debug log
    print("Request headers:", dict(request.headers))  # Debug log
    
    if current_user.is_authenticated:
        print(f"User is authenticated: {current_user.name}")  # Debug log
        return jsonify({
            "loggedIn": True,
            "user": {
                "name": current_user.name,
                "email": current_user.email,
                "profile_pic": current_user.profile_pic
            }
        })
    print("User is not authenticated")  # Debug log
    return jsonify({"loggedIn": False})

@app.route("/login")
def login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=REDIRECT_URI,
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
    
    code = request.args.get("code")
    
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    auth_response = request.url.replace("http://", "https://", 1)

    # Prepare and send request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=REDIRECT_URI,
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
    login_user(user, remember=True)  # Added remember=True for persistent session
    print(f"User logged in: {user.name}")  # Debug log
    print("Session data after login:", dict(session))  # Debug log
    print("Session cookie after login:", request.cookies.get('session'))  # Debug log
    print("All cookies after login:", request.cookies)  # Debug log
    print("Request headers after login:", dict(request.headers))  # Debug log

    # 팝업 창인 경우 success.html을 렌더링
    return render_template(
        'success.html',
        name=users_name,
        email=users_email,
        profile_pic=picture,
        frontend_url=FRONTEND_URL
    )

# @app.route("/logout", methods=['GET', 'OPTIONS'])
# def logout():
#     try:
#         logout_user()
#         return jsonify({
#             "status": "success",
#             "message": "Logged out successfully"
#         }), 200
#     except Exception as e:
#         return jsonify({
#             "status": "error",
#             "message": str(e)
#         }), 500

@app.route("/logout", methods=['GET', 'OPTIONS'])
def logout():
    try:
        print("Logging out user...")  # Debug log
        print("Session before logout:", dict(session))  # Debug log
        print("Cookies before logout:", request.cookies)  # Debug log
        
        logout_user()
        session.clear()  # Clear the session completely
        
        # Create response with cleared cookies
        response = jsonify({
            "status": "success",
            "message": "Logged out successfully"
        })
        
        # Add CORS headers for cookie deletion
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Origin'] = 'https://trippick.vercel.app'
        
        # Clear both session and remember_token cookies with proper settings
        for cookie_name in ['session', 'remember_token']:
            response.set_cookie(
                cookie_name,
                value='',
                expires=0,
                path='/',
                domain=None,
                secure=True,
                httponly=True,
                samesite='None'
            )
        
        print("Session after logout:", dict(session))  # Debug log
        print("Response headers:", dict(response.headers))  # Debug log
        
        return response
    except Exception as e:
        print(f"Error during logout: {str(e)}")  # Debug log
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Add a test endpoint to verify CORS is working
@app.route("/test", methods=["GET"])
def test():
    return jsonify({
        "x_forwarded_proto": request.headers.get("X-Forwarded-Proto"),
        "scheme": request.scheme
    }), 200


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
