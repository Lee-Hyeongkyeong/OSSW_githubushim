# OSSW_githubushim

# Travel Recommendation System with Chatbot

## Trippick - 떠나자, 나답게
여행자의 취향을 분석하여 맞춤형 여행 도시와 컨텐츠를 추천해주는 시스템입니다. 
친근하고 귀여운 챗봇을 통해 사용자에게 즉각적인 여행 정보를 제공합니다.

## 주요 기능

### 로그인 기능
- 구글 로그인 기능

### 여행 추천 시스템
- 사용자 취향 분석을 통한 맞춤형 여행 도시 추천
- 선택된 도시의 주요 관광지 및 컨텐츠 추천

### 챗봇 인터페이스 (chatbot 브랜치)
- OpenAI API를 활용한 자연어 처리를 통한 사용자와의 대화형 인터페이스
- Google Maps API를 활용한 위치 기반 서비스
- 장소 관련 질문에 대한 24시간 실시간 응답
- 추천 시스템에 대해 길찾기 url 제공
- (todo) 동일한 조건에 대해 장소 추가 추천

## 프로젝트 구조

```
OSSW_githubushim/
├── frontend/                 # 프론트엔드 디렉토리
│   ├── src/                 # 소스 코드
│   │   ├── assets/         # 이미지, 폰트 등 정적 자원
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── styles/        # CSS 스타일 파일
│   │   ├── App.js         # 메인 애플리케이션 컴포넌트
│   │   ├── App.css        # 메인 스타일
│   │   ├── index.js       # 진입점
│   │   └── index.css      # 전역 스타일
│   ├── public/              # 정적 파일
│   ├── package.json         # npm 패키지 설정
│   └── package-lock.json    # npm 패키지 잠금 파일
│
├── backend/                 # 백엔드 디렉토리
│   ├── googleLogin/        # 구글 로그인 관련
│   │   ├── db.py          # 데이터베이스 관련
│   │   ├── user.py        # 사용자 관련
│   │   ├── requirements.txt # 구글 로그인 관련 의존성 패키지 목록
│   │   └── __init__.py    # 패키지 초기화
│   │
│   ├── recommend/          # 추천 시스템
│   │   ├── city_routes.py     # 도시 추천 라우트
│   │   ├── content_routes.py  # 콘텐츠 추천 라우트
│   │   └── detail_routes.py   # 상세 정보 라우트
│   │
│   ├── survey/            # 설문 관련
│   │   ├── survey.py          # 설문 메인 로직
│   │   ├── city_recommend.py  # 도시 추천 로직
│   │   ├── content_recommend.py # 콘텐츠 추천 로직
│   │   ├── OS_data.py         # 운영체제 데이터
│   │   └── OS_tag.py          # 운영체제 태그
│   │
│   ├── templates/         # HTML 템플릿
│   ├── user_profiles/     # 사용자 프로필
│   ├── app.py             # 메인 애플리케이션 파일
│   ├── run.py             # 실행 파일
│   ├── schema.sql         # 데이터베이스 스키마
│   └── __init__.py        # Python 패키지 초기화
│
├── wsgi.py                # WSGI 서버 설정
├── sqlite_db             # SQLite 데이터베이스 파일
└── .gitignore           # Git 무시 파일 목록
```


## 백엔드 설치 및 실행 방법

1. **가상환경 생성 및 활성화**
   ```sh
   cd <프로젝트 루트>
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 또는
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass #powershell 사용할 때만
   .\venv\Scripts\activate  # Windows
   ```

2. **의존성 설치**
   ```sh
   pip install -r requirements.txt
   ```

3. **환경 변수 설정**
   `.env` 파일 생성 후 내용 입력
   ```sh
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=sqlite:///chatbot.db
   FLASK_ENV=development
   FLASK_DEBUG=1
   SECRET_KEY=your_secret_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=upir_google_client_secret_here
   ```
   
     
5. **서버 실행**
   프로젝트 루트에서
   ```sh
    python wsgi.py
   ```


##프론트엔드 설치 및 실행 방법

1. **의존성 설치**
   ```sh
   cd frontend
   npm install
   # 또는
   yarn install
   ```

2. **개발 서버 실행**
   ```sh
   npm start
   # 또는
   yarn start
   ```


## 기술 스택

### 프론트엔드
- React.js
- Node.js
- npm

### 백엔드
- Python
- Flask
- SQLAlchemy
- Google Maps API
- OpenAI API



## 오픈소스 라이선스

### Frontend Dependencies

#### MIT License
- React (v19.1.0) - https://github.com/facebook/react
- React DOM (v19.1.0) - https://github.com/facebook/react
- React Router DOM (v6.22.3) - https://github.com/remix-run/react-router
- React Scripts (v5.0.1) - https://github.com/facebook/create-react-app
- Styled Components (v6.1.18) - https://github.com/styled-components/styled-components
- @hello-pangea/dnd (v18.0.1) - https://github.com/hello-pangea/dnd
- @react-oauth/google (v0.12.2) - https://github.com/MomenSherif/react-oauth
- Axios (v1.9.0) - https://github.com/axios/axios
- @testing-library/dom (v10.4.0) - https://github.com/testing-library/dom-testing-library
- @testing-library/jest-dom (v6.6.3) - https://github.com/testing-library/jest-dom
- @testing-library/react (v16.3.0) - https://github.com/testing-library/react-testing-library
- @testing-library/user-event (v14.6.1) - https://github.com/testing-library/user-event

#### Apache License 2.0
- Web Vitals (v2.1.4) - https://github.com/GoogleChrome/web-vitals

### Backend Dependencies

#### MIT License
- Flask-Login - https://github.com/maxcountryman/flask-login
- Flask-CORS (v3.0.10) - https://github.com/corydolphin/flask-cors
- Flask-SQLAlchemy (v3.1.1) - https://github.com/pallets-eco/flask-sqlalchemy
- OpenAI (v1.3.0) - https://github.com/openai/openai-python
- Pydantic (v2.6.1) - https://github.com/pydantic/pydantic
- Pydantic Core (v2.16.2) - https://github.com/pydantic/pydantic-core

#### BSD-3-Clause License
- Flask (v2.2.5) - https://github.com/pallets/flask
- OAuthlib - https://github.com/oauthlib/oauthlib
- Python-dotenv (v0.19.2) - https://github.com/theskumar/python-dotenv
- HTTPX (v0.24.1) - https://github.com/encode/httpx

#### Apache License 2.0
- PyOpenSSL - https://github.com/pyca/pyopenssl
- Requests (v2.26.0) - https://github.com/psf/requests
- Google Maps (v4.10.0) - https://github.com/googlemaps/google-maps-services-python

## License Files

The license files for all dependencies can be found in the `licenses` directory. Each file is named according to the package name and contains the full text of the respective license.

## Project License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
