import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import img1 from '../assets/pic/survey-1.png'

const SurveyMain = () => {
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
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        </Description>
        <SurveyButton to="/survey-step1">설문 시작</SurveyButton>
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

const SurveyButton = styled(Link)`
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
