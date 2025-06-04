# Chatbot Backend

이 프로젝트는 사용자의 위치와 자연어 입력(예: "반경 3km 내 초밥집 추천해줘")을 바탕으로 Google Maps API와 OpenAI API를 활용해 장소를 추천해주는 챗봇 백엔드입니다.  
추천 이력(이미 추천한 장소) 관리, 반경/카테고리/정렬 기준 파싱, 거리·평점 기반 추천, DB 저장 기능을 제공합니다.

---

## 프로젝트트 구조

```
chatbot-backend/
├── .gitignore
├── README.md
├── requirements.txt
├── config.py                # 환경 변수 및 설정 로딩
├── package.json             # (VSCode 확장 개발 관련)
├── bfg-1.14.0.jar           # (무시 가능, BFG Repo-Cleaner)
├── app/
│   ├── __init__.py          # Flask 앱 팩토리 및 설정
│   ├── models.py            # SQLAlchemy DB 모델 (추천 이력)
│   ├── routes.py            # 주요 API 엔드포인트 및 추천 로직
│   ├── services/
│   │   ├── google_maps_api.py   # Google Maps API 연동
│   │   ├── location.py          # 위치 유효성 검사 등
│   │   ├── directions.py        # (미사용) 네이버 길찾기 API 예시
│   └── utils/
│       └── parser.py        # OpenAI로 자연어 파싱
├── instance/
│   └── chatbot.db           # SQLite DB 파일 (생성됨)
```

---

## 주요 기능

- **자연어 파싱:**  
  OpenAI API(gpt-4.1-nano 등)로 입력에서 카테고리, 반경, 정렬 기준 추출

- **장소 추천:**  
  Google Maps Places API로 주변 장소(카테고리 기반) 검색  
  평점(rating) 정보 포함, 리뷰 수(user_ratings_total)는 사용하지 않음

- **이동 시간 계산:**  
  Google Directions API로 대중교통 기준 이동 시간 및 거리 계산

- **추천 이력 관리:**  
  추천한 장소(place_id)를 DB에 저장,  
  "아까 추천한 것 제외" 등의 요청 시 이전 추천 장소는 제외

- **추천 결과:**  
  카테고리, 장소명, 주소, 평점, 이동 시간, 거리(m), 길찾기 URL 반환  
  최대 5개 결과 제공

---

## 설치 및 실행

1. **의존성 설치**
   ```sh
   pip install -r requirements.txt
   ```

2. **환경 변수 설정**
   - `.env` 파일에 아래와 같이 입력  
     (실제 파일은 .gitignore로 git에 포함되지 않음)
     ```
     OPENAI_API_KEY=...
     GOOGLE_MAPS_API_KEY=...
     SECRET_KEY=...
     DATABASE_URL=sqlite:///chatbot.db
     FLASK_ENV=development
     ```

3. **DB 테이블 생성**
   ```sh
   flask shell
   ```
   그리고 파이썬 프롬프트에서:
   ```python
   from app import create_app
   app = create_app()
   from app.models import db
   with app.app_context():
       db.create_all()
   ```

4. **서버 실행**
   ```sh
   flask run
   ```
   또는
   ```sh
   python -m flask run
   ```

---

## API 사용 예시

- **POST /chat**

  ```json
  {
    "latitude": 37.5061,
    "longitude": 126.9601,
    "user_input": "아까 추천해준 거 제외하고 반경 2km 이내의 카페 다섯 곳 추천해줘"
  }
  ```
  - 헤더에 `X-USER-ID`를 항상 동일하게 보내면 추천 이력이 제대로 관리됩니다.

  **응답 예시**
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
      },
      ...
    ]
  }
  ```

---

## 참고

- OpenAI 무료 크레딧 만료 시 결제 필요
- Google API 키는 반드시 발급받아야 정상 동작
- `.env` 파일은 반드시 git에 포함되지 않도록 `.gitignore`에 등록되어 있음
- DB 파일(chatbot.db)은 `instance/` 또는 프로젝트 루트에 생성됨

---

## 라이선스

MIT License