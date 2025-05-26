import React from 'react';
import styled from 'styled-components';

const CATEGORIES = [
  {
    title: '식당',
    items: [
      { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', alt: '팬케이크' },
      { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', alt: '샐러드' },
      { img: 'https://images.unsplash.com/photo-1550547660-d9450f859349', alt: '버거' },
      { img: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a', alt: '스테이크' }
    ]
  },
  {
    title: '액티비티',
    items: [
      { img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', alt: '서핑' },
      { img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', alt: '감천문화마을' },
      { img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b', alt: '청춘시장' },
      { img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', alt: '산책' }
    ]
  },
  {
    title: '축제',
    items: [
      { img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', alt: '불꽃축제' },
      { img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', alt: '거리공연' },
      { img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b', alt: '청춘시장' },
      { img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', alt: '서핑' }
    ]
  }
];

const RecommendationCourseMain = ({ name = '홍길동', city = '부산' }) => {
  return (
    <MainContainer>
      <Title>
        <span className="name">{name} 님을 위한</span>
        <br />
        <CityPoint>{city} 필수 방문 코스</CityPoint>
      </Title>
      <SectionList>
        {CATEGORIES.map((cat, idx) => (
          <CategoryBox key={cat.title} $isLast={idx === CATEGORIES.length - 1}>
            <CategoryTitle>{cat.title}</CategoryTitle>
            <ImageRow>
              {cat.items.map((item, i) => (
                <ImageThumb key={i}>
                  <img src={item.img} alt={item.alt} />
                </ImageThumb>
              ))}
            </ImageRow>
            <MoreButton>더보기 &gt;</MoreButton>
          </CategoryBox>
        ))}
      </SectionList>
    </MainContainer>
  );
};

const MainContainer = styled.main`
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44px 0 0 0;
  background: #fff;
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 38px;
  text-align: center;
  line-height: 1.4;
  .name {
    font-weight: 800;
    color: #111;
    letter-spacing: -0.5px;
  }
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 22px;
  }
`;

const CityPoint = styled.span`
  font-size: 2.1rem;
  font-weight: 800;
  color: #111;
  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const CategoryTitle = styled.div`
  font-size: 1.45rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 18px;
  @media (max-width: 600px) {
    font-size: 1.08rem;
    margin-bottom: 12px;
  }
`;

const SectionList = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 0 2vw;
  margin: 0 auto 60px auto;
  display: flex;
  flex-direction: column;
  gap: 34px;
  box-sizing: border-box;
`;

const CategoryBox = styled.section`
  background: #fafafa;
  border: 3px solid #FFA033;
  border-radius: 18px;
  padding: 32px 2vw 22px 2vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const ImageRow = styled.div`
  display: flex;
  gap: 2vw;
  margin-bottom: 18px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const ImageThumb = styled.div`
  width: 22vw;
  min-width: 80px;
  max-width: 220px;
  aspect-ratio: 1/1;
  border-radius: 10px;
  overflow: hidden;
  background: #eee;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;


const MoreButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  color: #222;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0;
  padding: 0;
  &:hover {
    text-decoration: underline;
    color: #FFA033;
  }
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

export default RecommendationCourseMain;
