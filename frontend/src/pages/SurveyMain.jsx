import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/pic/survey-1.png'

const SurveyMain = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const response = await fetch("https://127.0.0.1:5000/api/auth/check", { 
  //         credentials: "include",
  //         method: 'GET',
  //         headers: {
  //           'Accept': 'application/json'
  //         }
  //       });
        
  //       const data = await response.json();
  //       console.log('Login check response:', data); // 디버깅용
        
  //       // 응답 데이터 구조 확인 및 처리
  //       if (data && typeof data === 'object') {
  //         setIsLoggedIn(data.loggedIn === true);
  //       } else {
  //         console.error('Invalid response format:', data);
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error('Login check error:', error);
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  const handleStartSurvey = () => {
    console.log('Current login state:', isLoggedIn);
    // if (!isLoggedIn) {
    //   alert('로그인 후 이용해주세요.');
    //   return;
    // }
    navigate('/survey-step1');
  };

  return (
    <Container>
      <Main>
        <Banner>
          <BannerImg src={img1} alt="배너" />
          <BannerText>
            당신의<Highlight>여행 취향</Highlight>을 진단해드립니다.
          </BannerText>
        </Banner>
        <Description>
        국내에는 각기 다른 매력을 지닌 다양한 여행지가 있습니다. <br/>
        트립픽은 여러분의 취향에 꼭 맞는 여행지를 찾을 수 있도록 도와드립니다.<br/>

        <br/>

        간단한 6가지 질문에 답해주시면, 여러분의 여행 취향을 분석하여<br/>
        어울리는 도시 3곳을 추천해드릴게요. 추천받은 도시 중 하나를 선택하면, <br/>
        그 도시에 맞는 맞춤형 여행 콘텐츠와 정보를 안내해드립니다.<br/>
        
        <br/>

        지금 바로 설문을 시작하고, 나만의 여행 취향을 발견해보세요!
        </Description>
        <SurveyButton onClick={handleStartSurvey}>설문 시작</SurveyButton>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: #fff;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Main = styled.main`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 32px 0 0 0;
  position: relative;
`;

const Banner = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  margin: 0 auto 32px auto;
  background: #7ad1e6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
`;

const BannerText = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Highlight = styled.span`
  color: #FFA033;
`;

const Description = styled.div`
  margin: 36px 0 75px 0;
  color: #222;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SurveyButton = styled.button`
  background-color: #FFA033;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 36px;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 18px 0 0 0;
  cursor: pointer;

  &:hover {
    opacity: 80%;
  }
`;

export default SurveyMain;