# API 설정 가이드

## 개요
프론트엔드에서 백엔드 API URL을 환경변수로 관리하기 위해 `src/config/api.js` 파일을 사용합니다.

## 보안 중요사항 ⚠️
**API URL은 보안상 코드에 하드코딩하지 않고 반드시 환경변수로 관리합니다.**

## 필수 환경변수 설정

### .env 파일 생성 (필수)
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
REACT_APP_API_BASE_URL=https://ossw-githubushim.onrender.com
REACT_APP_CHATBOT_API_BASE_URL=https://ossw-githubushim.onrender.com/api/chatbot
```

### .env.local 파일 생성 (로컬 개발용)
로컬 개발 시에만 사용할 설정이 있다면 `.env.local` 파일을 생성하세요:

```env
REACT_APP_API_BASE_URL=https://127.0.0.1:5000
REACT_APP_CHATBOT_API_BASE_URL=https://localhost:5000/api/chatbot
```

## 사용법

### 컴포넌트에서 API URL 사용
```javascript
import API_CONFIG from '../config/api';

// API 호출 예시
const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/check`, {
  method: "GET",
  credentials: "include",
  headers: {
    "Accept": "application/json"
  }
});
```

### 챗봇 API 사용
```javascript
import API_CONFIG from '../config/api';

// axios 설정
axios.defaults.baseURL = API_CONFIG.CHATBOT_BASE_URL;
```

## 환경변수 설정 오류 시

환경변수가 설정되지 않으면 다음과 같은 에러가 발생합니다:
```
Error: REACT_APP_API_BASE_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.
```

이 경우 `.env` 파일이 올바르게 생성되었는지 확인하세요.

## 주의사항

1. **환경변수 파일은 .gitignore에 추가**
   - `.env` 파일은 민감한 정보를 포함하므로 Git에 커밋하지 마세요.
   - `.env.example` 파일을 만들어서 필요한 환경변수 목록만 공유하세요.

2. **React 환경변수 규칙**
   - React에서 환경변수를 사용하려면 `REACT_APP_` 접두사가 필요합니다.

3. **CORS 설정**
   - 백엔드에서 프론트엔드 도메인을 허용하도록 CORS 설정이 필요합니다.

4. **보안**
   - API URL을 코드에 하드코딩하지 마세요.
   - 환경변수를 통해 안전하게 관리하세요.

## 수정된 파일 목록

다음 파일들이 API URL을 환경변수로 변경되었습니다:

### Components
- `src/components/Navbar.jsx`
- `src/components/FloatingChat.jsx`

### Pages
- `src/pages/Home.jsx`
- `src/pages/Survey1.jsx`
- `src/pages/Survey1-1.jsx`
- `src/pages/Survey1-2.jsx`
- `src/pages/Survey2.jsx`
- `src/pages/Survey2-1.jsx`
- `src/pages/Survey2-2.jsx`
- `src/pages/Recommendation1.jsx`
- `src/pages/Recommendation2.jsx`
- `src/pages/Recommendation3.jsx`
- `src/pages/Recommendation4.jsx`
- `src/pages/Recommendation5.jsx`

### Tests
- `src/components/__tests__/Navbar.test.jsx`

### Config
- `src/config/api.js` (보안 강화) 