import React from 'react';
import styled from 'styled-components';
import img1 from '../assets/pic/about-1.png';
import img2 from '../assets/pic/about-2.png';
import icon from '../assets/pic/chatbot.png';

const About = () => {
  return (
    <Container>
        <MainSection>
            <IntroIcon src={icon}></IntroIcon>
            <IntroText>
                <IntroTitle>TRIPPICK: 떠나자, 나답게</IntroTitle>
                <IntroDesc>
                트립픽은 사용자 여행 스타일과 선호도를 분석해 맞춤형 여행지를 추천하고, <br/>
                AI 챗봇을 통해 실시간 여행 정보를 제공하는 여행 맞춤 추천 시스템입니다. 
                </IntroDesc>
            </IntroText>
        </MainSection>
        <ImageBanner>
            <MainImg src={img1} />
        </ImageBanner>
        <ContentSection>
            <ContentTitle>당신의 여행 스타일은 무엇입니까?</ContentTitle>
            <ContentText>
            TRIPPICK은 J 3명과 P 1명으로 이루어진 팀원들의 여행 경험에서 출발해 만들어진 시스템입니다. 여행을 떠날 때, 우리는 어떤 과정을 거칠까요? <br/>

            <br/>

            J는 가고 싶은 여행지를 선택하면 거기서 방문할 곳이나 가고 싶은 음식점 등을 미리 서칭해보고 계획을 세운 후 여행을 떠나죠. <br/>
            반면에 P는 여행을 떠난 후, 산책을 하고 싶다면 근처에 있는 공원을 찾아보고, 밥을 먹고 싶다면 길을 거닐다 발견한 음식점, 혹은 근처 맛집을 찾아 방문합니다. <br/>
            우리는 생각했습니다. J와 P 모두를 만족시킬만한 여행 시스템을 만들 수는 없을까? <br/>

            <br/>
            {/* <ContentSubTitle>주요 기능</ContentSubTitle>
            <li>맞춤형 여행지 추천(설문 기반)</li>
            <li>관심사별 콘텐츠 추천(맛집, 관광지, 액티비티 등)</li>
            <li>실제 방문자 리뷰 정보 제공</li>
            <li>AI 챗봇을 통한 실시간 장소 추천 및 길찾기 안내</li>
            <li>위치 기반 추천 및 대중교통 정보 제공</li>
            <li>Google OAuth 로그인 등 편리한 인증 기능</li> */}
            </ContentText>
        </ContentSection>
        <RowSection>
            <SubImg src={img2} />
            <RowTextBox>
            <ContentTitle>J와 P를 모두 만족시킬 수 있는 여행 시스템의 구현</ContentTitle>
            <RowContentText>              
              우리는 여행을 계획할 때 'J'형(계획형)과 'P'형(즉흥형) 모두의 니즈를 만족시키고자 하는 팀원들의 경험에서 출발했습니다. <br />
              기존 여행 서비스는 미리 계획을 세우는 사람(J)이나 즉흥적으로 움직이는 사람(P) 중 한 쪽에만 최적화된 경우가 많았습니다. <br />

              <br />

              TRIPPICK은 설문조사를 통해 사용자의 취향을 파악하고, 여행 API 데이터를 활용해 여러 도시를 추천합니다. <br />
              사용자가 도시를 선택하면, J형을 위해 미리 계획할 수 있는 다양한 명소와 맛집 정보를 제공하고, P형을 위해서는 챗봇이 실시간 위치와 상황에 맞는 장소를 즉각 추천합니다. <br />
              이를 통해 모든 유형의 여행자에게 만족스러운 여행 경험을 제공하는 것이 목표입니다. <br />

              <br />

              사용자는 간단한 설문을 통해 자신의 여행 성향(예: 활동형, 휴양형, 문화형)과 관심사(맛집, 사진 명소 등)를 입력하면, TRIPPICK이 이를 바탕으로 최적의 도시와 다양한 여행 콘텐츠(관광지, 맛집, 액티비티 등)를 추천해줍니다. <br />
              또한, 여행 중 궁금한 점이나 장소 추천이 필요할 때는 챗봇을 통해 실시간으로 정보를 얻을 수 있습니다. <br />

              <br />

              TRIPPICK은 React 기반의 프론트엔드와 Flask 기반의 백엔드로 구성되어 있으며, 주요 기능 구현에는 다음과 같은 기술과 외부 API가 활용됩니다.<br />
                {/* <ContentSubTitle>주요 기술 스택 및 API</ContentSubTitle>
                <ContentText>
                  <li>프론트엔드: React, Geolocation API(사용자 위치 정보 수집), 반응형 UI/UX</li>
                  <li>백엔드: Flask, Python, SQLAlchemy(데이터베이스 관리), flask-cors(CORS 문제 해결)</li>
                  <li>AI 챗봇: OpenAI GPT-4.1-nano API(자연어 처리 및 의도 파악), Google Maps API(장소 정보, 거리 계산, 길찾기), Google Directions API(대중교통 경로 안내)</li>
                  <li>인증: Google OAuth 2.0(로그인)</li>
                  <li>데이터 관리: Redis(캐시), SQLAlchemy(세션·추천 이력 관리), .env 파일(환경 변수 관리)</li>
                  <li>협업 및 배포: GitHub, CI/CD 파이프라인, Notion 기반 정보 공유</li>
                </ContentText><br/>
                <ContentSubTitle>구체적 기능 및 구현</ContentSubTitle>
                <li>사용자 설문 결과를 태그 기반 가중치로 변환, 도시 및 콘텐츠 추천 알고리즘 적용</li>
                <li>챗봇은 사용자의 자연어 입력에서 카테고리, 반경, 정렬 기준 등 핵심 정보를 추출해 맞춤 장소 추천</li>
                <li>위치 기반 서비스는 Haversine 공식으로 거리 계산, Google Maps API로 실시간 장소 검색 및 길찾기 안내</li>
                <li>챗봇은 LRU 캐시, 페이지네이션, 비동기 API 호출로 응답 속도 최적화</li>
                <li>OAuth 인증, CORS, JSON 파싱 등 실무적 문제를 해결하며 안정적인 서비스 제공</li>
                <li>데이터베이스와 캐시를 연동해 중복 추천 방지 및 세션 관리 강화</li> */}
              TRIPPICK은 앞으로도 추천 알고리즘 고도화, 챗봇 성능 개선, 모바일 앱 연동 등 다양한 확장과 개선을 계획하고 있습니다.
            </RowContentText>
            </RowTextBox>
        </RowSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
`;

const MainSection = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 150px 50px;
    gap: 30px;
`;

const IntroIcon = styled.img`
  width: 100px;
  height: 100px;
`;

const IntroText = styled.div``;

const IntroTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const IntroDesc = styled.div`
  color: #222222;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const ImageBanner = styled.div`
  width: 100%;
  margin: 32px 0 24px 0;
`;

const MainImg = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

const ContentSection = styled.section`
    text-align: center;
    margin: 70px 20px;
    padding: 0 18px;
`;

const ContentTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ContentSubTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 13px;
`;

const ContentText = styled.div`
  color: #222222;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 100px;
  margin-bottom: 150px;
`;

const RowContentText = styled.div`
  color: #222222;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 150px;
`;

const RowSection = styled.section`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 32px;
    margin: 50px 10%;
    padding: 0 18px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SubImg = styled.img`
  width: 35%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const RowTextBox = styled.div`
    flex: 1;
    min-width: 220px;
    margin-bottom: 100px;
`;

export default About;