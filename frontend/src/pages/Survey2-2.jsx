import React, { useState } from 'react';
import styled from 'styled-components';
import point from '../assets/pic/finalpoint.png';
import img1 from '../assets/pic/survey-1.png';
import { Link, useNavigate } from 'react-router-dom';

const options = [
  { key: '스테디셀러', label: '스테디셀러' },
  { key: '트렌디', label: '트렌디' },
  { key: '홍대병', label: '홍대병 스팟' }
];

const Survey2_2 = () => {
  const [selected, setSelected] = useState({
    스테디셀러: false,
    트렌디: false,
    홍대병: false,
  });

  const progress = 100; // 예시 진행률

  const handleToggle = (key) => {
    setSelected(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navigate = useNavigate();
  
  const handleNext = async () => {
    if (!Object.values(selected).some(Boolean)) {
        alert("장소를 선택해주세요!");
        return;
    }

    try {
      // localStorage에서 travel_style 가져오기
      const travelStyle = localStorage.getItem('travel_style');
      if (!travelStyle) {
        throw new Error('Travel style not found');
      }

      const selectedPlaces = Object.entries(selected)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key);

      const response = await fetch("https://127.0.0.1:5000/api/survey", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          travel_style: travelStyle,
          must_go: selectedPlaces
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      navigate("/recommend-city");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || '설문 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };


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
          Step 3
          <StepDotBar>
            <DotProgress style={{ width: `${progress}%` }} />
            <DotBg />
          </StepDotBar>
        </StepTitle>
        <StepIcon>
          <FinalImg src={point} />
        </StepIcon>
      </StepRow>
      <QuestionTitle>Q. 당신이 여행 중 꼭 가야 하는 장소는?</QuestionTitle>
      <ToggleList>
        {options.map(opt => (
          <ToggleBlock key={opt.key}>
            <OptionText>{opt.label}</OptionText>
            <ToggleSwitch
              checked={selected[opt.key]}
              onClick={() => handleToggle(opt.key)}
            >
              <Slider checked={selected[opt.key]} />
            </ToggleSwitch>
          </ToggleBlock>
        ))}
      </ToggleList>
      <GuideText>가고 싶은 곳을 모두 선택해 주세요.</GuideText>
      <NavRow>
        <NavPreButton to="/survey-step2-1">&lt; 이전</NavPreButton>
        <NavButton right onClick={handleNext}>다음 &gt;</NavButton>
      </NavRow>
    </SurveyContainer>
  );
};

// --- styled-components (기존 survey 스타일과 동일) ---

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

const QuestionTitle = styled.div`
  font-size: 1.35rem;
  font-weight: bold;
  margin: 34px 0 28px 0;
`;

const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: center;
  margin: 0 auto 38px auto;
  width: 80%;
`;

const ToggleBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 2px solid #FFA033;
  border-radius: 14px;
  width: 320px;
  padding: 18px 38px;
  font-size: 1.2rem;
  font-weight: bold;
`;

const OptionText = styled.div`
  text-align: left;
`;

const ToggleSwitch = styled.div`
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: ${({ checked }) => (checked ? '#FFA033' : '#ddd')};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
`;

const Slider = styled.div`
  position: absolute;
  top: 4px;
  left: ${({ checked }) => (checked ? '24px' : '4px')};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
`;

const GuideText = styled.div`
  color: #888;
  font-size: 1rem;
  margin-top: 10px;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 50px 25px 50px;
  padding-bottom: 200px;
`;

const NavPreButton = styled(Link)`
  background: none;
  border: none;
  color: #222;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  ${({ right }) => right && `text-align: right;`}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #222;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  ${({ right }) => right && `text-align: right;`}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Survey2_2;
