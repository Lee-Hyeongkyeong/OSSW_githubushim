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
project/
├── frontend/                # React 기반 프론트엔드
│   ├── public/             # 정적 파일
│   └── src/                # 소스 코드
│       └── components/     # React 컴포넌트
│           └── FloatingChat.jsx  # 챗봇 인터페이스
│
├── backend/                # Flask 기반 백엔드
│   ├── app/               # 애플리케이션 코드
│   │   ├── models.py      # 데이터베이스 모델
│   │   ├── routes.py      # API 라우트
│   │   ├── services/      # 비즈니스 로직
│   │   │   ├── google_maps_api.py  # Google Maps API 연동
│   │   │   └── location.py         # 위치 관련 서비스
│   │   └── utils/         # 유틸리티 함수
│   │       └── parser.py  # 요청 파싱
│   │
│   ├── googleLogin/       # Google 로그인 관련
│   ├── survey/           # 사용자 취향 설문
│   ├── recommend/        # 추천 시스템
│   └── user_profiles/    # 사용자 프로필 관리
```

*백엔드 실행 방법*

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
   cd backend
   pip install -r requirements.txt
   cd ..  #프로젝트 루트로 다시 이동해야 됩니당
   ```

3. **환경 변수 설정**
   - `.env` 파일 생성 후 내용 입력(notion에)
     
4. **DB 초기화**  #필요할 경우에만
   ```sh
   flask shell
   ```
   ```python
   from app import create_app
   app = create_app()
   from app.models import db
   with app.app_context():
       db.create_all()
   ```

5. **서버 실행**
   ```sh
    python wsgi.py
   ```


*프론트엔드 실행 방법*

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

## 설치 및 실행

### 프론트엔드
```bash
cd frontend
npm install
npm start
```

### 백엔드
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## 환경 변수 설정
`.env` 파일에 다음 환경 변수를 설정해야 합니다:
- `GOOGLE_MAPS_API_KEY`: Google Maps API 키
- `OPENAI_API_KEY`: OpenAI API 키

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
