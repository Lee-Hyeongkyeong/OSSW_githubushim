# Contributing to OSSW_githubushim

## Trippick "떠나자, 나답게"

여러분의 기여를 환영합니다 언제나 환영 아주 큰 환영🎉

### 단!
-  프로젝트 개요는 [README](https://github.com/Lee-Hyeongkyeong/OSSW_githubushim/blob/main/README.md)와 [챗봇README](https://github.com/Lee-Hyeongkyeong/OSSW_githubushim/blob/chatbotAPI/README.md) 에서 확인 부탁드립니다.
-  더 자세한 사항은 [Github Wiki](https://github.com/Lee-Hyeongkyeong/OSSW_githubushim/wiki) 필독!!

## New contributor Guide

- [깃허브 기여 방법](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [깃 세팅](https://docs.github.com/en/get-started/git-basics/set-up-git)
- [Github 플로우](https://docs.github.com/ko/get-started/using-github/github-flow)
- [Pull Request 협업](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)


## ✍️ 기여 방법

### 1. 레포지토리 포크(Fork) & 클론(Clone)
  - 본인의 GitHub 계정으로 포크한 후
  - git clone https://github.com/Lee-Hyeongkyeong/OSSW_githubushim.git
  - cd OSSW_githubushim

### 2. 새 기능/이슈용 브랜치 생성
  - git checkout -b feat/추천로직-개선
  - 또는
  - git checkout -b fix/주소파싱-오류

### 3. 코드 작성 및 커밋
  - Python 스타일 가이드는 PEP8을 준수해주세요.
  - 커밋 메시지는 다음과 같이 간결하고 명확하게 작성해주세요:
  
  - feat: 도시 추천 점수 계산 방식 변경 (코사인 유사도 도입)    
  - fix: 태그 부여 중 null 데이터 처리 오류 해결
  - docs: README 내 실행 예시 업데이트

### 4. 테스트 및 문서화
  - 변경 사항이 기존 로직을 깨지 않도록 직접 실행 테스트를 해주세요.
  - 새로운 기능을 추가한 경우, 주석 또는 README/Docstring을 업데이트해주세요.

### 5. PR(Pull Request) 생성
  - main이 아닌 dev 브랜치로 PR을 보내주세요.
  - PR 템플릿을 따라 변경 사항, 이유, 테스트 결과 등을 명확히 작성해주세요.

### 6. 이슈 생성
  - [이슈](https://github.com/Lee-Hyeongkyeong/OSSW_githubushim.git/issues) 탭에서 논의해 주세요.
   
### 7. 웹사이트 디자인 준수
  - 우리의 아름다운 [trippick 디자인](https://www.figma.com/design/AEyKTwbqzQHJPAwdU8kGKk/OSSW_%ED%8C%80%ED%94%8C_%EB%94%94%EC%9E%90%EC%9D%B8?t=11ieUEKUkdDip6XL-1)과 트립이(마스코트)를 지켜주세요.
     ![image](https://github.com/user-attachments/assets/41182af2-f692-4494-b188-ef25f2474968)


## 📌 기여 시 유의사항

  민감한 API Key는 .env 파일 또는 시크릿 설정을 따로 사용하며 절대 커밋하지 마세요.
  
  tagged_contents.json, user_profile.json 등의 출력 파일은 .gitignore 처리되어야 합니다.
  
  대규모 기능 추가 전에는 반드시 Issue를 생성하고 팀과 사전 논의해주세요.
  

## 🧪 우선적으로 기여가 필요한 항목

-  콘텐츠 태그 분류 정확도 향상
  
-  콘텐츠 필터링 시 filter_tags 적용 개선

-  Flask API를 통한 전체 추천 시스템 통합

-  테스트 자동화 및 API 문서화(OpenAPI)

-  챗봇 db 생성 및 추가 추천 로직(이전 출력값 제외) 

🙏 감사의 말
기여는 단순한 코드 커밋뿐만 아니라, 문서 수정, 피드백 제공, 이슈 리포팅 모두 환영합니다.
Trippick은 모두의 참여로 더 똑똑한 여행 추천 시스템이 됩니다! 🌏
