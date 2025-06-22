import React, { useState } from 'react';
import styled from 'styled-components';
import point from '../assets/pic/finalpoint.png';
import img1 from '../assets/pic/survey-1.png';
import { Link, useNavigate } from 'react-router-dom';
import API_CONFIG from '../config/api';

const images = [
  { key: "지식 쌓기", url: "https://images.unsplash.com/photo-1665888661223-2aa11fab76a4?" },
  { key: "체험", url: "https://images.unsplash.com/photo-1575780684471-ed79a358de9a?" },
  { key: "힐링", url: "https://images.unsplash.com/photo-1633712132667-663554221b91?" },
  { key: "탐험", url: "https://images.unsplash.com/photo-1567008386823-90c713249ed1?" }
];

const Survey2_1 = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  
  const progress = 80;

  const handleSelect = (idx) => {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, idx]);
      }
    }
  };

  const handleNext = async () => {
    try {
      // 선택한 옵션의 실제 값
      const selectedPurposes = selected.map(idx => images[idx].key);
      
      console.log("Sending survey data:", { 
        purposes: selectedPurposes 
      }); // 디버깅용

      // localStorage에서 travel_style_1과 travel_style_2 가져오기
      const travelStyle1 = localStorage.getItem('travel_style_1');
      const travelStyle2 = localStorage.getItem('travel_style_2');
      
      if (!travelStyle1 || !travelStyle2) {
        throw new Error('Travel style data not found. Please complete the previous steps.');
      }

      // travel_style을 통합하여 생성 (서버에서 기대하는 형식)
      const travelStyle = `${travelStyle1}_${travelStyle2}`;
      console.log("Combined travel_style:", travelStyle);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/survey`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          travel_style: travelStyle,
          purposes: selectedPurposes
        }),
      });

      // 응답이 JSON인지 확인
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버 응답이 JSON 형식이 아닙니다.");
      }

      const data = await response.json();
      console.log("Survey response:", data);

      if (!response.ok) {
        throw new Error(data.error || '서버 응답이 올바르지 않습니다.');
      }

      navigate("/survey-step2-2");
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes('Failed to fetch')) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert(error.message || '설문 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
          Step 2
          <StepDotBar>
            <DotProgress style={{ width: `${progress}%` }} />
            <DotBg />
          </StepDotBar>
        </StepTitle>
        <StepIcon>
          <FinalImg src={point} />
        </StepIcon>
      </StepRow>
      <QuestionTitle>Q. 이번 여행에서 당신이 얻어 가고 싶은 것은은?</QuestionTitle>
      <ImageGrid>
        {images.map((img, idx) => (
          <ImageCard
            key={idx}
            selected={selected.includes(idx)}
            onClick={() => handleSelect(idx)}
            disabled={selected.length === 2 && !selected.includes(idx)}
          >
            <OptionImg src={img.url} alt={`option${idx + 1}`} />
            {selected.includes(idx) && <SelectedOverlay>{selected.indexOf(idx) + 1}</SelectedOverlay>}
          </ImageCard>
        ))}
      </ImageGrid>
      <GuideText>최대 2개까지 선택할 수 있습니다.</GuideText>
      <NavRow>
        <NavPreButton to="/survey-step2">&lt; 이전</NavPreButton>
        <NavButton right onClick={handleNext}>다음 &gt;</NavButton>
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

const QuestionTitle = styled.div`
  font-size: 1.35rem;
  font-weight: bold;
  margin: 34px 0 28px 0;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 38px 32px;
  margin: 0 auto 38px auto;
  width: 80%;
`;

const ImageCard = styled.div`
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: ${({ selected }) => selected ? '0 0 0 4px #FFA033' : '0 0 0 0 transparent'};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: box-shadow 0.2s, opacity 0.2s;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

const OptionImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  display: block;
`;

const SelectedOverlay = styled.div`
  position: absolute;
  inset: 0;
  border: 4px solid #FFA033;
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  font-size: 1.3rem;
  font-weight: bold;
  color: #FFA033;
  background: rgba(255,255,255,0.08);
  &::after {
    content: attr(children);
    display: block;
    position: absolute;
    top: 8px;
    right: 12px;
  }
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

export default Survey2_1;
