import React, { useState } from 'react';
import styled from 'styled-components';
import point from '../assets/pic/finalpoint.png';
import img1 from '../assets/pic/survey-1.png'
import { Link } from 'react-router-dom';

const question = 'Q. 여행에서 가장 중요한 것은 무엇인가요?';
const options = [
  '맛집 탐방',
  '자연 경관',
  '액티비티',
  '휴식과 힐링'
];

const Survey1_2 = () => {
  const [selected, setSelected] = useState(0);

  // 진행률
  const progress = 40;

  return (
    <SurveyContainer>
      <Banner>
        <BannerImg src={img1} alt="배너" />
        <BannerText>
          당신의 <Highlight>여행 취향</Highlight>을 진단해드립니다.
        </BannerText>
      </Banner>
      <StepRow>
        <StepTitle>
          Step 1
          <StepDotBar>
            <DotProgress style={{ width: `${progress}%` }} />
            <DotBg />
          </StepDotBar>
        </StepTitle>
        <StepIcon>
          <FinalImg src={point}></FinalImg>
        </StepIcon>
      </StepRow>
      <QuestionBox>
        <QuestionTitle>{question}</QuestionTitle>
        <OptionsList>
          {options.map((opt, idx) => (
            <Option key={idx} onClick={() => setSelected(idx)}>
              <RadioCircle selected={selected === idx}>
                {selected === idx && <RadioDot />}
              </RadioCircle>
              <OptionText selected={selected === idx}>{opt}</OptionText>
            </Option>
          ))}
        </OptionsList>
      </QuestionBox>
      <NavRow>
        <NavButton to="/survey-step1-1">&lt; 이전</NavButton>
        <NavButton to="/survey-step2" right>다음 &gt;</NavButton>
      </NavRow>
    </SurveyContainer>
  );
};

const SurveyContainer = styled.div`
  width: 100%;
  background: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
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

const StepRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 50px 50px 25px 50px;
`;

const StepTitle = styled.div`
  font-size: 2.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const StepDotBar = styled.div`
  position: relative;
  width: 380px;         // 원하는 만큼 넓게 조정
  height: 12px;
  margin-left: 16px;
  margin-right: 24px;   // 아이콘과의 간격
  display: flex;
  align-items: center;
`;


const DotBg = styled.div`
  position: absolute;
  left: 0; top: 50%;
  width: 100%;
  height: 0;
  border-bottom: 6px dotted #fff;
  transform: translateY(-50%);
  z-index: 1;
`;

const DotProgress = styled.div`
  position: absolute;
  left: 0; top: 50%;
  height: 0;
  border-bottom: 6px dotted #FFA033;
  z-index: 2;
  transform: translateY(-50%);
  transition: width 0.3s;
`;

const StepIcon = styled.div`
  margin-bottom: 6px;
`;

const FinalImg = styled.img`
    width: 25px;
    height: auto;
`;

const QuestionBox = styled.div`
  margin: 50px 50px 25px 50px;
`;

const QuestionTitle = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 50px;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 55px;
  gap: 18px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RadioCircle = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #222;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

const RadioDot = styled.div`
  width: 14px;
  height: 14px;
  background: #222;
  border-radius: 50%;
`;

const OptionText = styled.span`
  font-size: 1.15rem;
  color: ${({ selected }) => (selected ? '#222' : '#222')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 50px 25px 50px;
  padding-bottom: 200px;
`;

const NavButton = styled(Link)`
  background: none;
  border: none;
  color: #222;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  ${({ right }) => right && `text-align: right;`}
`;

export default Survey1_2;
