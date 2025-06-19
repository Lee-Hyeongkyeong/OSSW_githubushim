import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import img1 from '../assets/pic/about-1.png';
import img2 from '../assets/pic/about-2.png';
import icon from '../assets/pic/chatbot.png';

// 1) fade-in up keyframes
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// 2) AnimatedSection: visible=true일 때 애니메이션 재생
const AnimatedSection = styled.section`
  opacity: 0;
  ${({ visible }) =>
    visible &&
    css`
      animation: ${fadeInUp} 0.8s ease-out forwards;
    `}
`;

export default function About() {
  const introRef = useRef(null);
  const contentRef = useRef(null);
  const rowRef = useRef(null); 
  const [introVisible, setIntroVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [rowVisible, setRowVisible] = useState(false);

  useEffect(() => {
    const opts = { threshold: 0.2 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === introRef.current) {
            setIntroVisible(true);
            io.unobserve(introRef.current);
          }
          if (entry.target === contentRef.current) {
            setContentVisible(true);
            io.unobserve(contentRef.current);
          }
          if (entry.target === rowRef.current) {
            setRowVisible(true);
            io.unobserve(rowRef.current);
          }
        }
      });
    }, opts);

    if (introRef.current) io.observe(introRef.current);
    if (contentRef.current) io.observe(contentRef.current);
    if (rowRef.current) io.observe(rowRef.current);

    return () => io.disconnect();
  }, []);

  return (
    <Container>
      {/* Intro 섹션: AnimatedSection으로 교체 */}
      <AnimatedSection ref={introRef} visible={introVisible}>
        <MainSection>
          <IntroIcon src={icon} alt="챗봇 아이콘" />
          <IntroText>
            <IntroTitle>TRIPPICK: 떠나자, 나답게</IntroTitle>
            <IntroDesc>
              트립픽에 오신 여행자님을 환영합니다. <br />
              여러분의 여행 스타일과 취향을 똑똑하게 분석해 꼭 맞는 전국의 여행지를 추천해드릴게요.
              <br />
              언제 어디서든 궁금한 장소 정보는 AI 챗봇 트립이에게 물어보면 실시간으로 딱 맞는 정보를 알려드려요.
              <br />
              어디로든 떠날 준비만 하세요!
            </IntroDesc>
          </IntroText>
        </MainSection>
      </AnimatedSection>

      {/* 배너 이미지는 그대로 */}
      <ImageBanner>
        <MainImg src={img1} alt="여행 배너" />
      </ImageBanner>

      {/* Content 섹션: AnimatedSection으로 교체 */}
      <AnimatedSection ref={contentRef} visible={contentVisible}>
        <ContentSection>
          <ContentTitle>어떤 여행을 원하고 있나요?</ContentTitle>
          <ContentText>
            TRIPPICK은 J 성향의 팀원 3명과 P 성향의 팀원 1명으로 이루어진 팀원들의 여행 경험에서
            출발해 만들어진 시스템입니다. <br />
            <br />
            여행을 떠날 때, 우리는 어떤 과정을 거칠까요? <br />
            <br />
            J 성향의 친구는 가고 싶은 여행지를 선택하면 거기서 방문할 곳이나 가고 싶은 음식점
            등을 꼼꼼히 조사해보고 계획을 세운 후 여행지로 향하죠. <br />
            반면, P 성향의 친구는 여행을 떠난 후 산책을 하고 싶다면 근처에 있는 공원을 찾아보고,
            <br />
            밥을 먹고 싶다면 길을 거닐다 발견한 음식점, 혹은 근처 맛집을 찾아 방문합니다. <br />
            우리는 생각했습니다. <br />
            J와 P 여행자 모두를 만족시킬만한 여행 시스템을 만들 수는 없을까? <br />
            <br />
          </ContentText>
        </ContentSection>
      </AnimatedSection>

      {/* Row 섹션 */}
      <AnimatedSection ref={rowRef} visible={rowVisible}>
        <RowContainer>
          <ImageCard>
            <SubImg src={img2} alt="계획형 vs 즉흥형" />
          </ImageCard>
          <TextCard>
            <ContentTitle>J와 P를 모두 만족시킬 수 있는 여행 시스템</ContentTitle>
            <RowContentText>
              TRIPPICK은 여행을 계획할 때 'J'형(계획형)과 'P'형(즉흥형),<br />
              모두의 니즈를 만족시키고자 하는 팀원들의 경험을 바탕으로 <br />출발했습니다. <br /><br />
              TRIPPICK은 설문조사를 통해 사용자의 취향을 파악하여 여행 데이터를 활용해 여러 도시를 추천합니다. <br /><br />
              J형의 여행자에게는 미리 계획할 수 있는 다양한 관광지와 여행지 <br />구석구석에 있는 맛집과 숨은 명소들의 정보를 제공하고,<br /> P형의 여행자에게는 언제 어디서든 AI 챗봇 트립이가 실시간 위치와 <br />상황에 맞는 장소를 즉각 추천해줍니다. <br />
              <br /> 이를 통해 우리는 모든 유형의 여행자에게 만족스러운 여행 경험을 제공하는 것을 목표로 합니다. <br /><br />
              앞으로 더욱 발전하는 TRIPPICK과 함께 즐거운 여행을 떠나보세요!
            </RowContentText>
          </TextCard>
        </RowContainer>
      </AnimatedSection>
    </Container>
  );
}

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

const ContentText = styled.div`
  color: #222222;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 100px;
  margin-bottom: 150px;
`;



// ─── 추가/교체할 Styled Components ─────────────────────────────────

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ImageCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const SubImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const TextCard = styled.div`
  background: #fafafa;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
`;

const ContentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #222;
`;

const RowContentText = styled.p`
  color: #444;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-line;
`;
