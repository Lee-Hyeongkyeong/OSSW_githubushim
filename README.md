# OSSW_githubushim

# Travel Recommendation System with Chatbot

## Trippick - 떠나자, 나답게
여행자의 취향을 분석하여 맞춤형 여행 도시와 컨텐츠를 추천해주는 시스템입니다. 
친근하고 귀여운 챗봇을 통해 사용자에게 즉각적인 여행 정보를 제공합니다.

## 주요 기능

### 로그인 기능
Trippick은 Google OAuth 2.0 로그인을 지원하여 사용자가 간편하고 안전하게 로그인할 수 있도록 합니다.
로그인된 사용자는 추천 결과를 기반으로 자신의 여행 취향 데이터를 저장하고, 향후 다시 방문 시 동일한 조건으로 재추천을 받을 수 있는 기능으로 확장할 수 있습니다.

- Google OAuth 연동 (@react-oauth/google 사용)

- 로그인 후 사용자 정보 DB 저장 (googleLogin/db.py, googleLogin/user.py)

- Access Token을 통한 인증 처리 및 사용자 상태 유지

🔧 향후 기능 (계획):

- 사용자 추천 이력 저장

- 즐겨찾기/찜 기능

- 사용자별 추천 로그 기반 개인화 모델 개선

### 여행 추천 시스템
Trippick의 핵심 기능은 설문 결과를 기반으로 한 맞춤형 도시 및 콘텐츠 추천입니다.
사용자의 여행 취향을 다각도로 분석하여, 가장 적합한 도시와 그 도시에서 즐길 수 있는 콘텐츠(관광지, 맛집, 액티비티)를 추천합니다.

✅ 도시 추천
- 설문 결과(여행 유형, 선호 지역, 예산 등)를 기반으로 각 도시의 태그 점수를 계산

- city_recommend.py에서 유사 태그 기반 점수 계산 로직 구현

- 결과는 도시별 점수 순으로 정렬되어 추천

✅ 콘텐츠 추천
- 도시를 선택하면, 해당 도시의 관광지/맛집/활동을 카테고리별로 추천

- content_recommend.py에서 사용자 태그와 콘텐츠 태그의 유사도를 비교해 점수화

- 정제된 TourAPI 데이터를 기반으로 함 (OS_data.py, OS_tag.py)

📍 위치 기반 추천
- Google Maps API와 Haversine 공식을 활용하여 사용자와 추천 장소 간의 거리를 계산

- 콘텐츠 정보에 Google Maps 기반 길찾기 링크도 제공하여, 실제 이동 경로 안내까지 가능

🤖 챗봇 연계
- 사용자가 "서울에서 맛집 알려줘", "부산 관광지 뭐가 좋아?"와 같이 자연어로 입력하면, 챗봇이 추천 API를 호출해 실시간으로 응답

- OpenAI GPT-4.1-nano를 활용한 자연어 파싱과 연동

### 챗봇 인터페이스 (chatbot 브랜치)
Trippick은 사용자의 자연스러운 대화 기반 질의응답 시스템을 제공하는 챗봇 기능을 탑재하고 있습니다.
이 챗봇은 단순한 텍스트 응답을 넘어, 사용자의 여행 취향과 위치 정보를 반영하여 개인 맞춤형 여행 정보를 실시간으로 제공합니다.

✅ 주요 기능
- 자연어 기반 입력 처리
사용자는 “서울에서 가볼만한 데 알려줘”, “부산 맛집 추천해줘”와 같은 질문을 자유롭게 입력할 수 있습니다.
→ 시스템은 이를 파싱하여 도시/카테고리 정보 추출 후, 적절한 API 호출을 통해 응답합니다.

- OpenAI GPT 기반 처리
OpenAI GPT-4.1-nano 엔진을 사용하여 사용자의 질문에서 핵심 정보를 추출하고, 이를 통해 가장 적합한 콘텐츠를 추천합니다.
→ 예: chatbot: "경주에서 야경 좋은 곳" → → city='경주', tag='야경' 추출 → 콘텐츠 추천 API 호출

- 추천 결과에 대한 부가 정보 제공
콘텐츠 추천 결과와 함께:

해당 장소의 Google Maps URL

거리 기반 추천 우선순위

카테고리(관광지/맛집/액티비티) 구분
등을 포함한 상세 정보를 제공합니다.

📍 위치 기반 대응
- 사용자가 현재 위치를 설정하면, 챗봇은 사용자와 각 추천 장소 간의 거리를 계산하여 최적의 위치를 제공합니다.

- 거리 계산은 Haversine 공식을 기반으로 하며, Google Maps Directions API를 통해 대중교통 경로도 안내 가능합니다.

🛠️ 향후 계획 (To-do)
- 동일 조건에서 추가 장소 재추천 기능 (e.g., "다른 데도 보여줘")

- GPT 모델 응답 최적화 (태그 누락 방지, 의미 파악 정밀도 개선)

- 사용자별 대화 이력 기반 컨텍스트 추천 강화



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
