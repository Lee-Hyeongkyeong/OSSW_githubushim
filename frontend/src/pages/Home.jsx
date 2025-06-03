import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import img1 from '../assets/pic/home-1.png';

const Home = () => {
  return (
    <HOMEpage>
        <IMGlist>
            <IMGitem>
                <img src={img1} alt="travel" />
            </IMGitem>
            <IMGtext>
                나를 위한 맞춤형 여행<br />지금 계획해보세요
            </IMGtext>
            <BUTTON to='/survey-main'>시작하기</BUTTON>
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
        <BUTTON to='/survey-main'>시작하기</BUTTON>
      </TRENDtext>
    </HOMEpage>
  );
};

const HOMEpage = styled.div`
  width: 100%;
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
    height: 
    object-fit: cover;
  }
`;

const IMGtext = styled.div`
  text-align: center;
  margin: 48px 0 32px 0;
  font-size: 2rem;
  font-weight: bold;
`;

const BUTTON = styled(Link)`
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