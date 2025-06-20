# chatbot_backend/app/config.py
import os

# .env 또는 환경 변수에서 읽어오기
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
