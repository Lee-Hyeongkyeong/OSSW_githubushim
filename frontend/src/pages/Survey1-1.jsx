import React, { useState, userNavigate } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import point from '../assets/pic/finalpoint.png';
import img1 from '../assets/pic/survey-1.png'
import { Link, useNavigate } from 'react-router-dom';
import API_CONFIG from '../config/api';

const question = 'Q. 당신이 여행에서 가장 중요하게 생각하는 것은?';
const initialItems = [
  { id: '1', label: '음식점' },
  { id: '2', label: '액티비티' },
  { id: '3', label: '관광지' }
];

const Survey1_1 = () => {
  const [items, setItems] = useState(initialItems);
  const navigate = useNavigate();
  const progress = 20;

  // 드래그 결과 처리
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  // "다음" 버튼 클릭 시
  const handleNext = async () => {
    try {
      // 선택한 옵션의 실제 값
      const selectedPriority = items.map(item => item.label);
      console.log("Sending survey data:", { 
        priorities: selectedPriority 
      }); // 디버깅용

      // localStorage에서 travel_style 가져오기
      const travelStyle = localStorage.getItem('travel_style');
      if (!travelStyle) {
        throw new Error('Travel style not found');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/survey`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          travel_style: travelStyle,
          priorities: selectedPriority
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

      navigate("/survey-step1-2");
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="priority-list">
            {(provided) => (
              <DraggableList
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(provided, snapshot) => (
                      <DraggableItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      >
                        <RankCircle>{idx + 1}</RankCircle>
                        <ItemLabel>{item.label}</ItemLabel>
                      </DraggableItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </DraggableList>
            )}
          </Droppable>
        </DragDropContext>
        <GuideText>드래그 앤 드롭으로 순서를 바꿔주세요</GuideText>
      </QuestionBox>
      <NavRow>
        <NavButton to="/survey-step1">&lt; 이전</NavButton>
        <NavButton as="button" right onClick={handleNext}>다음 &gt;</NavButton>
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

const DraggableList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
`;

const DraggableItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ isDragging }) => (isDragging ? '#ffe7c2' : '#fff')};
  border: 2px solid #FFA033;
  border-radius: 14px;
  padding: 18px 38px;
  font-size: 1.2rem;
  font-weight: bold;
  width: 320px;
  box-shadow: ${({ isDragging }) =>
    isDragging ? '0 4px 16px rgba(255,160,51,0.18)' : 'none'};
  cursor: grab;
  transition: box-shadow 0.2s, background 0.2s;
`;

const RankCircle = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #FFA033;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 18px;
`;

const ItemLabel = styled.span`
  flex: 1;
  text-align: left;
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

const NavButton = styled(Link)`
  background: none;
  border: none;
  color: #222;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  ${({ right }) => right && `text-align: right;`}
`;

export default Survey1_1;
