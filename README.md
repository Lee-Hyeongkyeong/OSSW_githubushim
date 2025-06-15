Add commentMore actions

## 👥 팀원 & 역할 분담

| 이름 | 역할 | 담당 기능 |
|------|------|-----------|
| 박인영 | 팀장 / 백엔드 C + AI / 문서화 / 발표 | 챗봇 추천 기능 + 데이터 API |
| 이예나 | 백엔드 B | 콘텐츠 추천 시스템 |
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

## Open Source Licenses

This project uses the following open source libraries:

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