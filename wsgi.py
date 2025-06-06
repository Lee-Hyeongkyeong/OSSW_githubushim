import sys
import os

# backend 디렉토리를 Python 경로에 추가
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app import app
print(app.url_map)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
