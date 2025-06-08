import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')
    
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///chatbot.db')
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')