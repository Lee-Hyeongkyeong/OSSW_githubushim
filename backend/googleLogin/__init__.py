#from flask import Flask
#from flask_login import LoginManager
#from survey.survey import survey_bp
#app.register_blueprint(survey_bp)


#app = Flask(__name__)
#app.secret_key = "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"

#login_manager = LoginManager()
#login_manager.init_app(app)

# ⚠️ 여기가 핵심! 기존 라우트가 있는 모듈(app.py)을 import해야 라우트 
#import googleLogin.app

# 변경 후(정리된 googleLogin/__init__.py)
# googleLogin 패키지에서 노출할 모듈(파일) 이름만 정의합니다.
__all__ = ["db", "user"]