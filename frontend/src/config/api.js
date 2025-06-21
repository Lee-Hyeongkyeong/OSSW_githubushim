// API 설정 파일
const API_CONFIG = {
  // 환경변수가 반드시 필요함 (보안상 URL을 코드에 노출하지 않음)
  BASE_URL: process.env.REACT_APP_API_BASE_URL || (() => {
    throw new Error('REACT_APP_API_BASE_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  })(),
  
  // 챗봇 API URL
  CHATBOT_BASE_URL: process.env.REACT_APP_CHATBOT_API_BASE_URL || (() => {
    throw new Error('REACT_APP_CHATBOT_API_BASE_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  })()
};

export default API_CONFIG; 