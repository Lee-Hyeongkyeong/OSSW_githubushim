# OSSW_githubushim

# Travel Recommendation System with Chatbot

여행자의 취향을 분석하여 맞춤형 여행 도시와 컨텐츠를 추천해주는 시스템입니다. 챗봇을 통해 사용자와 자연스러운 대화를 나누며 여행 정보를 제공합니다.

## 주요 기능

### 여행 추천 시스템
- 사용자 취향 분석을 통한 맞춤형 여행 도시 추천
- 선택된 도시의 주요 관광지 및 컨텐츠 추천
- Google Maps API를 활용한 위치 기반 서비스

### 챗봇 인터페이스
- 자연어 처리를 통한 사용자와의 대화형 인터페이스
- 여행 관련 질문에 대한 실시간 응답
- 추천 시스템과 연계된 맞춤형 정보 제공

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

##백엔드 설치 및 실행 방법

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
   - `.env` 파일 생성 후 내용 입력(notion에)
     
4. **서버 실행**
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



## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
