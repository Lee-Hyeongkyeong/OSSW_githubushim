# 백엔드 환경변수 설정 가이드

## 개요
백엔드에서 프론트엔드 URL을 환경변수로 관리하기 위해 설정이 필요합니다.

## 필수 환경변수

### .env 파일 생성 (백엔드 루트에)
백엔드 프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URL 설정
BASE_URL=https://ossw-githubushim.onrender.com
REDIRECT_URI=https://ossw-githubushim.onrender.com/login/callback

# 프론트엔드 URL (새로 추가)
FRONTEND_URL=https://trippick.vercel.app

# 보안 키
SECRET_KEY=your_secret_key_here
```

### .env.local 파일 생성 (로컬 개발용)
로컬 개발 시에만 사용할 설정이 있다면 `.env.local` 파일을 생성하세요:

```env
# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URL 설정 (로컬 개발용)
BASE_URL=https://127.0.0.1:5000
REDIRECT_URI=https://127.0.0.1:5000/login/callback

# 프론트엔드 URL (로컬 개발용)
FRONTEND_URL=http://localhost:3000

# 보안 키
SECRET_KEY=your_secret_key_here
```

## 수정된 파일

### 1. backend/app.py
- `FRONTEND_URL` 환경변수 추가
- `success.html` 렌더링 시 프론트엔드 URL 전달

### 2. backend/templates/success.html
- 하드코딩된 `http://localhost:3000` 제거
- 서버에서 전달받은 `frontend_url` 사용

## 주의사항

1. **환경변수 파일은 .gitignore에 추가**
   - `.env` 파일은 민감한 정보를 포함하므로 Git에 커밋하지 마세요.

2. **Google OAuth 설정**
   - Google Cloud Console에서 올바른 redirect URI를 설정해야 합니다.
   - 배포된 서버: `https://ossw-githubushim.onrender.com/login/callback`
   - 로컬 개발: `https://127.0.0.1:5000/login/callback`

3. **CORS 설정**
   - 현재 `https://trippick.vercel.app`로 설정되어 있습니다.
   - 프론트엔드 도메인이 변경되면 CORS 설정도 업데이트해야 합니다.

## 보안

- API 키와 시크릿을 코드에 하드코딩하지 마세요.
- 환경변수를 통해 안전하게 관리하세요.
- 프로덕션 환경에서는 강력한 SECRET_KEY를 사용하세요. 