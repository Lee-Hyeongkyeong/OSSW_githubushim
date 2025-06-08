"""
WSGI 진입점
- Flask 애플리케이션 인스턴스 생성
- 서버 실행을 위한 진입점
"""

from app import create_app

# Flask 애플리케이션 인스턴스 생성
app = create_app()

if __name__ == '__main__':
    app.run() 