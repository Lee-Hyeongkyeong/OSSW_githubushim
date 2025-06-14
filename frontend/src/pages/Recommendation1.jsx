import React, { useState } from "react";
import styled from "styled-components";

const cityList = [
  {
    key: "포항이당",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b",
    desc: "포항하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하"
  },
  {
    key: "부산이당",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    desc: "포항하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하"
  },
  {
    key: "전주당",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    desc: "포항하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하하"
  }
];

const RecommendationMain = ({ name = "홍길동" }) => {
  const [selected, setSelected] = useState(null);

  return (
    <MainContainer>
      <Title>이 도시는 어때요?</Title>
      <SubTitle>
        <b>{name}</b> 님의 여행 취향에 맞는 도시들을 골라 봤어요.<br />
        아래 도시 중 하나를 선택하면, 도시에서 즐길 수 있는 다양한 방문지들을 추천해드릴게요!
      </SubTitle>
      <CityCardList>
        {cityList.map((city, idx) => (
          <CityCard
            key={city.key}
            selected={selected === idx}
            onClick={() => setSelected(idx)}
          >
            <CityImg src={city.img} alt={city.key} />
            <CityName>{city.key}</CityName>
            <CityDesc>{city.desc}</CityDesc>
          </CityCard>
        ))}
      </CityCardList>
      <SelectButton
        disabled={selected === null}
        onClick={() => {
          if (selected !== null) {
            // 선택된 도시 처리
          }
        }}
      >
        선택
      </SelectButton>
    </MainContainer>
  );
};

const MainContainer = styled.main`
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0 0 0;
  background: #fff;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 18px;
  text-align: center;
`;

const SubTitle = styled.div`
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  margin-bottom: 48px;
  line-height: 1.6;
`;

const CityCardList = styled.div`
  display: flex;
  gap: 44px;
  justify-content: center;
  margin-bottom: 54px;
  flex-wrap: wrap;
`;

const CityCard = styled.div`
  width: 300px;
  background: ${({ selected }) => (selected ? "#FFF3E0" : "#fff")};
  border: 4px solid ${({ selected }) => (selected ? "#FFA033" : "#FFA033")};
  border-radius: 16px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 18px 18px 24px 18px;
  transition: border 0.2s, background 0.2s, transform 0.2s;
  transform: ${({ selected }) => (selected ? "scale(1.06)" : "scale(1)")};
  &:hover {
    border-color: #ffb755;
    background: #FFF3E0;
    transform: scale(1.03);
  }
`;


const CityImg = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid #eee;
`;

const CityName = styled.div`
  font-size: 1.45rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
  text-align: center;
`;

const CityDesc = styled.div`
  font-size: 1.02rem;
  color: #555;
  text-align: center;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.8em;
  line-height: 1.6;
  word-break: break-all;
`;

const SelectButton = styled.button`
  background: #FFA033;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  padding: 18px 80px;
  margin-top: 18px;
  margin-bottom: 60px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  box-shadow: 0 4px 16px rgba(255,160,51,0.08);
  &:hover:enabled {
    background: #ffb755;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


export default RecommendationMain;
