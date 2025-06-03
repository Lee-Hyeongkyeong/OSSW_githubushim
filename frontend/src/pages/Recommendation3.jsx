import React from 'react';
import styled from 'styled-components';

// 예시 이미지 데이터 (실제 서비스에 맞게 교체)
const images = [
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    alt: '팬케이크',
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    alt: '샐러드',
  },
  {
    src: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    alt: '버거',
  },
  {
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    alt: '서핑보드',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    alt: '감천문화마을',
  },
  {
    src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    alt: '청춘시장',
  },
];

const RecommendationGridMain = () => {
  return (
    <MainContainer>
      <TabMenu>
        <TabItem active>식당</TabItem>
        <TabItem>문화</TabItem>
        <TabItem>액티비티</TabItem>
        <TabItem>힐링</TabItem>
        <TabItem>기타</TabItem>
      </TabMenu>
      <SearchAdd>+ 검색 조건 추가</SearchAdd>
      <ImageGrid>
        {images.map((img, idx) => (
          <ImageCard key={idx}>
            <ImageThumb src={img.src} alt={img.alt} />
          </ImageCard>
        ))}
      </ImageGrid>
      <Pagination>
        <PageButton>&lt; 이전</PageButton>
        <PageNumber>1</PageNumber>
        <PageButton>다음 &gt;</PageButton>
      </Pagination>
    </MainContainer>
  );
};

const MainContainer = styled.main`
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 0 0 40px 0;
`;

const TabMenu = styled.nav`
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: center;
  gap: 36px;
  margin: 32px 0 18px 0;
`;

const TabItem = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ active }) => (active ? '#FFA033' : '#888')};
  border-bottom: ${({ active }) => (active ? '4px solid #FFA033' : 'none')};
  padding: 6px 0 8px 0;
  cursor: pointer;
  transition: color 0.2s;
`;

const SearchAdd = styled.div`
  width: 100%;
  max-width: 700px;
  font-size: 1.18rem;
  margin: 18px 0 36px 0;
  color: #222;
  font-weight: 500;
  text-align: left;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px 36px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 48px auto;
  justify-items: center;
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 18px;
  }
`;

const ImageCard = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Pagination = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  margin-top: 18px;
  font-size: 1.25rem;
`;

const PageButton = styled.button`
  background: none;
  border: none;
  color: #111;
  font-size: 1.18rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #FFA033;
  }
`;

const PageNumber = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #111;
`;

export default RecommendationGridMain;
