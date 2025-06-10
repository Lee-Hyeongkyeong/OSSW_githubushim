// To do list
// 1. 2025 트렌드 경로 수정: name '회원' 반영되지 않음
// 2. 2025 트렌드 데이터 fetch: 로그인 안한 상태에서 navigate 이동할 경우 데이터 fetch되지 않음
// 3. for you 이동 전에 survey history 없으면 이동 막아야 함 (혹은 survey 페이지로 이동)

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';
// import img1 from '../assets/pic/home-1.png';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("https://127.0.0.1:5000/api/auth/check", { 
          credentials: "include",
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        const data = await response.json();
        console.log('Login check response:', data); // 디버깅용
        
        // 응답 데이터 구조 확인 및 처리
        if (data && typeof data === 'object') {
          setIsLoggedIn(data.loggedIn === true);
          console.log('Login state updated:', data.loggedIn); // 디버깅용
        } else {
          console.error('Invalid response format:', data);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Login check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleStartClick = async () => {
    try {
      console.log('Checking login status...'); // Debug log
      // 로그인 상태 확인
      const loginResponse = await fetch("https://127.0.0.1:5000/api/auth/check", {
        credentials: "include",
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      console.log('Login response status:', loginResponse.status); // Debug log
      const loginData = await loginResponse.json();
      console.log('Login check response:', loginData);
      
      // 응답 데이터 구조 확인 및 처리
      if (!loginData || typeof loginData !== 'object') {
        console.error('Invalid response format:', loginData);
        alert('서버 응답이 올바르지 않습니다.');
        return;
      }

      if (loginData.loggedIn !== true) {
        console.log('User is not logged in'); // Debug log
        alert('로그인 후 이용해주세요.');
        return;
      }

      console.log('User is logged in, checking survey history...'); // Debug log
      // 설문 이력 확인
      const surveyResponse = await fetch("https://127.0.0.1:5000/api/survey/history", {
        credentials: "include",
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      console.log('Survey response status:', surveyResponse.status); // Debug log
      const surveyData = await surveyResponse.json();
      console.log('Survey history response:', surveyData);
      
      if (surveyData.hasHistory) {
        navigate('/recommendation');
      } else {
        navigate('/survey-main');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('상태 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <HOMEpage>
        <IMGlist>
            <ImageSlider/>
            {/* <IMGitem>
                <img src={img1} alt="travel" />
            </IMGitem> */}
            <IMGtext>
                나를 위한 맞춤형 여행<br />지금 계획해보세요
            </IMGtext>
            <BUTTON 
             onClick={handleStartClick}
            >시작하기</BUTTON>
        </IMGlist>

        <TRENDlist>
            <TRENDintro>2025년 국내 가장 인기 있는 여행지</TRENDintro>
            <TRENDcardsection>
                <TRENDcard onClick={() => navigate('/recommend-abstract', { state: { name: '회원', city: '제주특별자치도' } })}>
                    <CardImage src="https://img.freepik.com/premium-photo/scenic-view-oilseed-rape-field-against-sky_1048944-28641999.jpg" alt="jeju island" />
                    <TITLE>제주특별자치도</TITLE>
                    <TEXT>한라산, 오름, 해변, 올레길, 로컬 맛집 등 자연과 액티비티, 미식이 모두 어우러진 한국 대표 관광지</TEXT>
                </TRENDcard>
                <TRENDcard onClick={() => navigate('/recommend-abstract', { state: { name: '회원', city: '서울특별시' } })}>
                    <CardImage src="https://mediahub.seoul.go.kr/uploads/hubTheme/2024/08/fRyAuEGXWZBzZkbzrNPrilMwoWORNeJh.jpg" alt="Seoul" />
                    <TITLE>서울특별시</TITLE>
                    <TEXT>경복궁·창덕궁 등 유서 깊은 고궁과 명동, 홍대 등 전통과 현대가 조화를 이루는 문화·예술·쇼핑의 중심지</TEXT>
                </TRENDcard>
                <TRENDcard onClick={() => navigate('/recommend-abstract', { state: { name: '회원', city: '부산광역시' } })}>
                    <CardImage src="https://www.visitbusan.net/uploadImgs/files/cntnts/20200101173014369" alt="Busan" />
                    <TITLE>부산광역시</TITLE>
                    <TEXT> 해운대, 태종대, 부산타워 등 바다 명소, 그리고 활기찬 도시 분위기, 아름다운 야경과 다양한 문화 체험</TEXT>
                </TRENDcard>
            </TRENDcardsection>
        </TRENDlist>

      <TRENDtext>
        <MAIN>나의 취향에 맞는 트렌드를<br />발견하고 싶다면?</MAIN>
        <SUB>
          지금 바로 나의 취향 설문을 진행하고<br />
          나에게 맞는 도시와 방문지를 확인해보세요!
        </SUB>
        <BUTTON 
        onClick={handleStartClick}
        >시작하기</BUTTON>
      </TRENDtext>
    </HOMEpage>
  );
};

const HOMEpage = styled.div`
  width: 100%;
  background: #fff;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
`;

const IMGlist = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const IMGitem = styled.div`
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IMGtext = styled.div`
  text-align: center;
  margin: 48px 0 32px 0;
  font-size: 2rem;
  font-weight: bold;
`;

const BUTTON = styled.button`
  background-color: #ffa033;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 36px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 20px 0;
  &:hover {
    opacity: 50%;
  }
`;

const TRENDlist = styled.div`
  background: #4b2e13;
  padding: 32px 0;
  margin: 40px 0;
`;

const TRENDintro = styled.div`
  color: #ffffff;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 28px;
`;

const TRENDcardsection = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

const TRENDcard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  width: 220px;
  min-width: 180px;
  max-width: 260px;
  flex: 1 1 220px;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 24px;
  &:hover {
    border-color: #ffb755;
    background: #FFF3E0;
    transform: scale(1.03);
  }
`;


const CardImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #eee;
  @media (max-width: 768px) {
    height: 100px;
  }
`;


const TITLE = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const TEXT = styled.div`
  color: #888888;
  font-size: 0.92rem;
`;

const TRENDtext = styled.div`
  text-align: center;
  margin: 48px 0;
`;

const MAIN = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
`;

const SUB = styled.div`
  color: #444444;
  margin-bottom: 18px;
  font-size: 1.05rem;
`;

export default Home;