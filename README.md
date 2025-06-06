Add commentMore actions

## 👥 팀원 & 역할 분담

| 이름 | 역할 | 담당 기능 |
|------|------|-----------|
| 박인영 | 팀장 / 백엔드 C + AI / 문서화 / 발표 | 챗봇 추천 기능 + 데이터 API |
| 이예나 | 백엔드 B / 문서화 | 콘텐츠 추천 시스템 |
| 이형경 | 프론트엔드 + 디자인 / AI | 화면 구성, UI |
| 최재훈 | 백엔드 A + AI | 사용자 설문 처리 & 추천 알고리즘 |

✅ 백엔드 A :
사용자 설문 데이터를 구조화하여 저장/전달
설문 기반 도시 추천 로직 구현 (콘텐츠 기반 필터링)
사용자 입력 → 도시 추천까지의 파이프라인 설계
관련 데이터셋 가공 및 테스트

✅ 백엔드 B :
도시 선택 후 관광지, 식당, 액티비티 추천 알고리즘 개발
장소별 카테고리, 특징 기반으로 유사도 계산
JSON 형태로 프론트에 추천 데이터 제공
(필요 시) Google Places API, OpenTripMap API 등 활용

✅ 백엔드 C :
간단한 챗봇 백엔드 구축 (조건 기반 or Dialogflow 연동)
시간/위치 기반 추천 로직 처리 (Mock 데이터 기반이라도 OK)
모든 API 통합 관리 (FastAPI 등에서 RESTful 설계)

# 챗봇 프로젝트

이 프로젝트는 사용자의 위치와 자연어 입력을 바탕으로 Google Maps API와 OpenAI API를 활용해 장소를 추천해주는 챗봇 애플리케이션입니다.

## 주요 기능 (MVP)

- **자연어 파싱:** OpenAI API로 입력에서 카테고리, 반경, 정렬 기준 추출
- **장소 추천:** Google Maps Places API로 주변 장소(카테고리 받아서 사용자 위치 기반) 검색
- **사용자 위치 정보 반영:** Geolocation API로 사용자 위치 받아옴옴

## 추가 기능

- **이동 시간 계산:** Google Directions API로 대중교통 기준 이동 시간 및 거리 계산
- **추천 결과:** 카테고리, 장소명, 주소, 평점, 이동 시간, 거리, 길찾기 URL 반환
- **반경 거리 반영:** 사용자의 요청에 따라 거리 반영(기본값: 2km)
- **나열 순서 반영:** 요청에 따라 거리순 혹은 평점순으로 결과 나열(기본값: 평점순)

  # todo-list
  - **추천 이력 관리:** 추천한 장소를 DB에 저장하고 이전 추천 장소 제외 기능 

## 기술 스택

    ### 백엔드
    - Python 3.x
    - Flask
    - SQLAlchemy
    - OpenAI API
    - Google Maps API

    ### 프론트엔드
    - React 18.2.0
    - Styled Components
    - Axios

## 프로젝트 구조

```
chatbot/
├── chatbot-backend/          # 백엔드 (서버)
│   ├── app/
│   │   ├── __init__.py      # Flask 앱 팩토리 및 설정
│   │   ├── models.py        # SQLAlchemy DB 모델
│   │   ├── routes.py        # API 엔드포인트 및 추천 로직
│   │   ├── services/        # 외부 API 연동 서비스
│   │   └── utils/           # 유틸리티 함수
│   ├── config.py            # 환경 변수 및 설정
│   ├── requirements.txt     # Python 의존성
│   └── instance/            # DB 파일
│
└── chatbot-frontend/        # 프론트엔드 (클라이언트)
    ├── src/
    │   ├── components/      # 재사용 가능한 컴포넌트
    │   ├── pages/          # 페이지 컴포넌트
    │   ├── styles/         # 스타일 관련 파일
    │   ├── utils/          # 유틸리티 함수
    │   └── App.js          # 메인 애플리케이션
    └── package.json        # Node.js 의존성
```

## 설치 및 실행

### 필수 조건
- Python 3.x
- Node.js (v14.0.0 이상)
- npm 또는 yarn
- OpenAI API 키
- Google Maps API 키

### 백엔드 설정

1. **가상환경 생성 및 활성화**
   ```sh
   cd chatbot-backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 또는
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass #powershell 사용 시
   .\venv\Scripts\activate  # Windows
   ```

2. **의존성 설치**
   ```sh
   pip install -r requirements.txt
   ```

3. **환경 변수 설정**
   - `.env` 파일 생성 후 아래 내용 입력
     ```
     OPENAI_API_KEY=your_openai_api_key
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     SECRET_KEY=your_secret_key
     DATABASE_URL=sqlite:///chatbot.db
     FLASK_ENV=development
     ```

4. **DB 초기화**
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
   flask run
   ```

### 프론트엔드 설정

1. **의존성 설치**
   ```sh
   cd chatbot-frontend
   npm install
   # 또는
   yarn install
   ```

2. **환경 변수 설정**
   - `.env` 파일 생성 후 아래 내용 입력
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

3. **개발 서버 실행**
   ```sh
   npm start
   # 또는
   yarn start
   ```

## API 사용법

### POST /chat

**요청 예시:**
```json
{
  "latitude": 37.5061,
  "longitude": 126.9601,
  "user_input": "반경 2km 이내의 카페 추천해줘"
}
```

**응답 예시:**
```json
{
  "recommendations": [
    {
      "키워드": "카페",
      "장소명": "카페 이름",
      "주소": "서울시 ...",
      "평점": 4.5,
      "대중교통 소요 시간": "10분",
      "거리(m)": 800,
      "길찾기 url": "https://maps.google.com/..."
    }
  ]
}
```

## 주의사항

- DB 파일은 자동으로 생성되며 `instance/` 디렉토리에 저장됩니다.

## 라이선스

MIT License 