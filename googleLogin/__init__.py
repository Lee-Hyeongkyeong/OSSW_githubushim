from flask import Flask
from flask_login import LoginManager

app = Flask(__name__)
app.secret_key = "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"

login_manager = LoginManager()
login_manager.init_app(app)

# ⚠️ 여기가 핵심! 기존 라우트가 있는 모듈(app.py)을 import해야 라우트 
import googleLogin.app
