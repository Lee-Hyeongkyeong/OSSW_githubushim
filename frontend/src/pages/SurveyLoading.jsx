import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const DOT_COUNT = 12;
const DOT_COLOR = "#FFA033";
const DOT_SIZE = 16;
const DOT_GAP = 16;


const TOTAL_DURATION = 2; // seconds
const WAVE_DURATION = 1.5;  // seconds
const WAVE_PERCENT = (WAVE_DURATION / TOTAL_DURATION) * 100;

const waveUpDown = keyframes`
  0%, 10% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-18px);
    /* 느리게 올라감: 0~30% */
    animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
  }
  ${WAVE_PERCENT}%,
  100% {
    /* 빠르게 내려오고, 나머지 시간은 멈춤 */
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
`;

const Dot = styled.div`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  background: ${DOT_COLOR};
  border-radius: 4px;
  display: inline-block;
  margin-right: ${DOT_GAP}px;

  ${({ idx }) => css`
    animation: ${waveUpDown} ${TOTAL_DURATION}s both infinite;
    animation-delay: ${3 + idx * 0.13}s;
  `}
`;

const DotBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 150px 0 50px 0;
`;

const LoadingText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #222;
  margin: 50px 0 0 0;
`;

const Main = styled.main`
  width: 100%;
  max-width: 700px;
  margin: 50px auto;
  text-align: center;
  padding: 32px 0 0 0;
`;

const Container = styled.div`
  width: 100%;
  background: #fff;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
`;


const SurveyLoading = () => (
  <Container>
    <Main>
      <DotBar>
        {[...Array(DOT_COUNT)].map((_, i) => (
          <Dot key={i} idx={i} />
        ))}
      </DotBar>
      <LoadingText>데이터를 로딩하고 있어요!</LoadingText>
    </Main>
  </Container>
);

export default SurveyLoading;