import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../assets/pic/home-1.png';

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
            <IMGitem>
                <img src={img1} alt="travel" />
            </IMGitem>
            <IMGtext>
                나를 위한 맞춤형 여행<br />지금 계획해보세요
            </IMGtext>
            <BUTTON 
             onClick={handleStartClick}
            >시작하기</BUTTON>
        </IMGlist>

        <TRENDlist>
            <TRENDintro>회원님을 위한 요즘 트렌드</TRENDintro>
            <TRENDcardsection>
                <TRENDcard>
                    <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b" alt="포항이당" />
                    <TITLE>포항이당</TITLE>
                    <TEXT>포항이당설명설명설명설명설명설명설명설명설명설명설명설명설명</TEXT>
                </TRENDcard>
                <TRENDcard>
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" alt="부산이당" />
                    <TITLE>부산이당</TITLE>
                    <TEXT>부산이당설명설명설명설명설명설명설명설명설명설명설명설명설명</TEXT>
                </TRENDcard>
                <TRENDcard>
                    <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" alt="전주당" />
                    <TITLE>전주당</TITLE>
                    <TEXT>전주당설명설명설명설명설명설명설명설명설명설명설명설명설명</TEXT>
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
        // onClick={handleStartClick}
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
`;

const TRENDcard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  width: 200px;
  text-align: center;
  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 12px;
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