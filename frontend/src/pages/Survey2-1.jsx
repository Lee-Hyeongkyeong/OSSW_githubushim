import React, { useState } from 'react';
import styled from 'styled-components';
import point from '../assets/pic/finalpoint.png';
import img1 from '../assets/pic/survey-1.png';
import { Link, useNavigate } from 'react-router-dom';

const images = [
  { key: "역사", url: "https://images.unsplash.com/photo-1665888661223-2aa11fab76a4?" },
  { key: "체험", url: "https://images.unsplash.com/photo-1575780684471-ed79a358de9a?" },
  { key: "힐링", url: "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?" },
  { key: "탐험", url: "https://images.unsplash.com/photo-1567008386823-90c713249ed1?" }
];

const Survey2_1 = () => {
  const [selected, setSelected] = useState([]);

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

  const navigate = useNavigate();

  // 다음 버튼 클릭 시
  const handleNext = () => {
    if (selected.length === 0) {
      alert("최소 1개 이상 선택해 주세요!");
      return;
    }
    // 선택이 1개 또는 2개일 때만 다음으로 이동
    navigate("/survey-step2-2");
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
