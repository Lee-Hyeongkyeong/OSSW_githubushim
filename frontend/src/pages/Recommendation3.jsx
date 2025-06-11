import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const tabLabels = ["맛집", "체험 & 액티비티", "역사 & 문화", "힐링 & 자연", "관광"];
// 예시 이미지 데이터 (실제 서비스에 맞게 교체)

const RecommendationGridMain = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [imgIdx, setImgIdx] = useState(0);
  // const images = selectedItem
  // ? [selectedItem.firstimage, selectedItem.firstimage2].filter(Boolean)
  // : [];


  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };  
  
  // const handlePrev = (e) => {
  //   e.stopPropagation();
  //   setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  // };
  // const handleNext = (e) => {
  //   e.stopPropagation();
  //   setImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  // };   

  const location = useLocation();
  const selectedTab = location.state?.selectedTab || "맛집";
  const city = location.state?.city || "서울";

  const [activeTab, setActiveTab] = useState(selectedTab);
  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [group3, setGroup3] = useState([]);  
  const [group4, setGroup4] = useState([]);  
  const [group5, setGroup5] = useState([]);  

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch(`https://127.0.0.1:5000/api/recommend/details?city=${city}`, {
      credentials: "include",  // 로그인 세션 쿠키가 필요하다면 추가

    })
      .then(res => res.json())
      .then(data => {
        setGroup1(data.group1.slice(0, 100));
        setGroup2(data.group2.slice(0, 100));
        setGroup3(data.group3.slice(0, 100));
        setGroup4(data.group4.slice(0, 100));
        setGroup5(data.group5.slice(0, 100));
      });
  }, []);

  const handleTabClick = (tab) => { //페이지 초기화
    setActiveTab(tab);
    setPage(1);
  };

  const getCurrentGroup = () => {
    if (activeTab === "맛집") return group1 || [];
    if (activeTab === "체험 & 액티비티") return group2 || [];
    if (activeTab === "역사 & 문화") return group3 || [];
    if (activeTab === "힐링 & 자연") return group4 || [];
    if (activeTab === "관광") return group5 || [];

    return [];
  };

  const currentGroup = getCurrentGroup();
  const paginated = currentGroup.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(currentGroup.length / itemsPerPage);

  return (
    <MainContainer>
      {modalOpen && selectedItem && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTopBar>
              <ModalTitle>{selectedItem.title}</ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalTopBar>
            <ModalImageWrapper>
              {selectedItem.firstimage && (
                <ModalImage src={selectedItem.firstimage} alt={selectedItem.title} />
              )}
            </ModalImageWrapper>
            <ModalAddress>
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(selectedItem.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#333', textDecoration: 'none', fontWeight: 'bold' }}
              >
                주소: {selectedItem.addr1} {selectedItem.addr2}
              </a>
            </ModalAddress>
            <TagList>
              {(selectedItem.tags || []).map((tag, i) => (
                <Tag key={i}>#{tag}</Tag>
              ))}
            </TagList>
          </ModalContent>
        </ModalOverlay>
      )}
      <TabMenu>
        {tabLabels.map((label) => (
          <TabItem
            key={label}
            active={activeTab === label}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </TabItem>
        ))}
      </TabMenu>
      <ImageGrid>
        {paginated.map((item, idx) => (
        <CardWrapper key={idx}>
          <ImageCard onClick={() => openModal(item)}>
            <ImageThumb src={item.firstimage} alt={item.title} />
          </ImageCard>
          <ImageTitle onClick={() => openModal(item)}>{item.title}</ImageTitle>
        </CardWrapper>
      ))}
    </ImageGrid>
      <Pagination>
        <PageButton disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; 이전</PageButton>
        <PageNumber>{page}</PageNumber>
        <PageButton disabled={page === totalPages} onClick={() => setPage(page + 1)}>다음 &gt;</PageButton>
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
  margin: 65px 0;
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

const ImageTitle = styled.div`
  margin-top: 8px;          
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  max-width: 180px;        
  word-break: keep-all;
  line-height: 1.3;
  /* 길이가 너무 길면 말줄임을 하고 싶으면 아래 주석을 해제:
  max-height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  */
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ModalTopBar = styled.div`
  background: #FFA033;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px 20px 32px;
  border-radius: 16px 16px 0 0;
  margin-bottom: 40px;
`;

const ModalTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 500px;
  max-width: 90vw;
  // padding: 24px;
  position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
`;

const ModalImageWrapper = styled.div`
  width: 80%;
  max-width: 350px;   // 기존보다 100px 줄임
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const ModalImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
`;

// const NavButton = styled.button`
//   position: absolute;
//   top: 50%;
//   ${({ left }) => (left ? 'left: -60px;' : '')}
//   ${({ right }) => (right ? 'right: -60px;' : '')}
//   transform: translateY(-50%);
//   background: white;
//   border: none;
//   color: gray;
//   font-size: 1.5rem;
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
//   cursor: pointer;
//   z-index: 2;
//   opacity: 0.85;
//   &:hover { opacity: 50%; }
// `;

const ModalAddress = styled.div`
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
  &:hover {
    opacity: 70%;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 45px;
`;

const Tag = styled.span`
  background: #f5f5f5;
  color: #FFA033;
  border-radius: 16px;
  padding: 5px 18px;
  font-size: 1rem;
  font-weight: 500;
`;


export default RecommendationGridMain;
