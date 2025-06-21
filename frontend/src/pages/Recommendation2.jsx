import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from "react-router-dom";
import SurveyLoading from './SurveyLoading';
import API_CONFIG from '../config/api';

const RecommendationCourseMain = () => {
  const location = useLocation();
  const { userName = null, city = null } = location.state || {};

  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [group3, setGroup3] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const goToTab = (tabName) => {
    navigate("/recommend-detail", { state: { selectedTab: tabName, city} });
  };
  
  useEffect(() => {
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}/api/recommend/contents?city=${city}`, {
      credentials: "include",  // 로그인 세션 쿠키가 필요하다면 추가

    })
      .then(res => res.json())
      .then(data => {
        setGroup1(data.group1.slice(0, 4));
        setGroup2(data.group2.slice(0, 4));
        setGroup3(data.group3.slice(0, 4));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      });
  }, [city]);

  if (loading) {
    return <SurveyLoading />;
  }

  return (
    <MainContainer>
      <Title>
        <span className="name">{userName} 님을 위한</span>
        <br />
        <CityPoint>{city} 필수 방문 코스</CityPoint>
      </Title>
      <SectionList>
          <CategoryBox>
            <CategoryTitle>식당</CategoryTitle>
              <ImageRow>
                {group1.map((item, i) => (
                  <ImageThumb key={i}>
                    <img src={item.firstimage} alt={item.title} />
                  </ImageThumb>
                ))}
              </ImageRow>
            <MoreButton onClick={() => goToTab("맛집")}>더보기 &gt;</MoreButton>
          </CategoryBox>

          <CategoryBox>
          <CategoryTitle>액티비티</CategoryTitle>
          <ImageRow>
            {group2.map((item, i) => (
              <ImageThumb key={i}>
                <img src={item.firstimage} alt={item.title} />
              </ImageThumb>
            ))}
          </ImageRow>
          <MoreButton onClick={() => goToTab("체험 & 액티비티")}>더보기 &gt;</MoreButton>
        </CategoryBox>

        <CategoryBox>
          <CategoryTitle>관광</CategoryTitle>
          <ImageRow>
            {group3.map((item, i) => (
              <ImageThumb key={i}>
                <img src={item.firstimage} alt={item.title} />
              </ImageThumb>
            ))}
          </ImageRow>
          <MoreButton onClick={() => goToTab("관광")}>더보기 &gt;</MoreButton>
        </CategoryBox>
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
