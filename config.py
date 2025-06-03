import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')
    
    # Naver Search API
    NAVER_CLIENT_ID = os.getenv('NAVER_CLIENT_ID')
    NAVER_CLIENT_SECRET = os.getenv('NAVER_CLIENT_SECRET')
    
    # Naver Maps API
    NAVER_MAPS_CLIENT_ID = os.getenv('NAVER_MAPS_CLIENT_ID')
    NAVER_MAPS_CLIENT_SECRET = os.getenv('NAVER_MAPS_CLIENT_SECRET')
    NAVER_MAPS_URL = os.getenv('NAVER_MAPS_URL', 'https://naveropenapi.apigw.ntruss.com/map-direction/v1')
    
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///chatbot.db')
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')