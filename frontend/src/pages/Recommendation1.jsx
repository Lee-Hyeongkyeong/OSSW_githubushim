import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const cityList = [
  {
    key: "서울특별시",
    img: "http://tong.visitkorea.or.kr/cms/resource/94/3487594_image2_1.jpg", // 남산타워 사진 등
    desc: "전통과 현대가 공존하는 대한민국의 수도로, 경복궁, 남산타워, 한강 등 다양한 관광지가 있습니다."
  },
  {
    key: "인천광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/03/2599103_image2_1.jpg",
    desc: "국제공항이 위치한 관문 도시로, 송도, 차이나타운, 강화도 등의 관광지가 있습니다."
  },
  {
    key: "대전광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/27/3486427_image2_1.jpg",
    desc: "과학과 교육의 중심지로, 엑스포과학공원과 계룡산 국립공원이 유명합니다."
  },
  {
    key: "대구광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/06/2737006_image2_1.jpg",
    desc: "패션과 섬유 산업의 중심지이자 팔공산, 서문시장 등 볼거리가 많은 도시입니다."
  },
  {
    key: "광주광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/17/2917917_image2_1.jpg",
    desc: "예향의 도시로 불리며, 예술과 민주화의 상징적인 장소들이 많은 남도의 중심지입니다."
  },
  {
    key: "부산광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/42/3071042_image2_1.JPG",
    desc: "해운대와 광안리 해변, 자갈치 시장 등으로 유명한 활기찬 해양 도시입니다."
  },
  {
    key: "울산광역시",
    img: "http://tong.visitkorea.or.kr/cms/resource/24/2871524_image2_1.JPG",
    desc: "산업도시이자 태화강 국가정원과 간절곶 등의 자연 명소가 있는 도시입니다."
  },
  {
    key: "세종특별자치시",
    img: "http://tong.visitkorea.or.kr/cms/resource/76/3353976_image2_1.jpg",
    desc: "행정 중심 복합도시로 개발 중이며 조용하고 깨끗한 자연환경이 인상적인 도시입니다."
  },
  {
    key: "경기도",
    img: "http://tong.visitkorea.or.kr/cms/resource/09/2757509_image2_1.jpg",
    desc: "서울을 둘러싼 대도시권으로, 수원 화성, DMZ, 에버랜드 등 다양한 관광지가 있습니다."
  },
  {
    key: "강원특별자치도",
    img: "http://tong.visitkorea.or.kr/cms/resource/78/2733278_image2_1.jpg",
    desc: "동해안 해변과 설악산, 평창 등으로 유명한 자연 중심의 힐링 여행지입니다."
  },
  {
    key: "충청북도",
    img: "http://tong.visitkorea.or.kr/cms/resource/07/3348507_image2_1.JPG",
    desc: "내륙 중심에 위치한 자연과 전통이 어우러진 도시로, 청풍호와 속리산이 유명합니다."
  },
  {
    key: "충청남도",
    img: "http://tong.visitkorea.or.kr/cms/resource/00/3334100_image2_1.jpg",
    desc: "공주, 부여의 백제 유적지와 서해안 낙조가 아름다운 힐링 여행지입니다."
  },
  {
    key: "전북특별자치도",
    img: "http://tong.visitkorea.or.kr/cms/resource/50/3479250_image2_1.jpg",
    desc: "전통과 맛의 도시로 유명하며, 전주 한옥마을과 다양한 전통 문화가 있습니다."
  },
  {
    key: "전라남도",
    img: "http://tong.visitkorea.or.kr/cms/resource/64/3422964_image2_1.png",
    desc: "남도의 정취가 가득한 지역으로 순천만, 여수, 담양 등 자연과 미식이 유명합니다."
  },
  {
    key: "경상북도",
    img: "http://tong.visitkorea.or.kr/cms/resource/38/3421438_image2_1.jpg",
    desc: "신라의 수도 경주, 안동 하회마을 등 역사와 전통이 살아 숨 쉬는 도시입니다."
  },
  {
    key: "경상남도",
    img: "http://tong.visitkorea.or.kr/cms/resource/83/3494283_image2_1.jpg",
    desc: "통영, 남해, 진주 등 남해안을 따라 펼쳐진 다양한 해양 문화 관광지가 있습니다."
  },
  {
    key: "제주특별자치도",
    img: "http://tong.visitkorea.or.kr/cms/resource/66/3096066_image2_1.jpg",
    desc: "한국의 대표 섬 관광지로, 한라산, 성산일출봉, 협재해변 등 자연이 매력적인 섬입니다."
  }
];

const RecommendationMain = () => {
  // 1) 서버에서 받은 추천 결과를 담을 상태
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [userName, setUserName] = useState(null);

    const navigate = useNavigate();

  // 2) 마운트 시 한 번만 호출
  useEffect(() => {
    fetch("https://127.0.0.1:5000/api/userinfo", {
      credentials: "include" // 세션 기반 로그인일 경우 필요
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setUserName(data.name);
      })
      .catch((err) => {
        console.error("이름 불러오기 실패:", err);
      });
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://127.0.0.1:5000/api/recommend/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",  // 로그인 세션 쿠키가 필요하다면 추가
          body: JSON.stringify({ top_n: 3 })
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        const json = await res.json();
        setRecommendations(json.recommendations || []);
      } catch (err) {
        console.error("추천 요청 실패:", err);
        setError(err.message || "추천 API 호출 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <MainContainer>
      <Title>이 도시는 어때요?</Title>
      <SubTitle>
        <b>{userName}</b> 님의 여행 취향에 맞는 도시들을 골라 봤어요.
        <br />
        아래 도시 중 하나를 선택하면, 도시에서 즐길 수 있는 다양한 방문지들을 추천해드릴게요!
      </SubTitle>
      {loading && <SubTitle>추천을 불러오는 중…</SubTitle>}
      {error && <SubTitle>❌ 오류: {error}</SubTitle>}
      <CityCardList>
        {/* 3) 로딩이 끝났고, 에러도 없으며, 추천 결과가 비어 있을 때 */}
        {!loading && !error && recommendations.length === 0 && (
          <SubTitle>추천된 도시가 없습니다.</SubTitle>
        )}
        {/* 4) 추천 결과 3개만 렌더링 */}
        {!loading &&
          !error &&
          recommendations.map((item, idx) => {
            // item = { city: "서울특별시", score: 320 }
            // 미리 정의된 cityList에서 해당 도시 정보(key, img, desc)를 찾아옴
            const found = cityList.find((c) => c.key === item.city) || {};

            return (
              <CityCard 
                key={item.city + idx}
                // **추가: 클릭 시 selected에 idx 저장**
                onClick={() => setSelected(idx)}
                // **추가: 선택된 카드에는 selected=true 전달**
                selected={selected === idx}
              >
                <CityImg
                  src={
                    found.img ||
                    "https://via.placeholder.com/300x160?text=No+Image"
                  }
                  alt={item.city}
                />
                <CityName>{item.city}</CityName>
                <CityDesc>
                  {found.desc || "설명 정보가 없습니다."}
                </CityDesc>
              </CityCard>
            );
          })}
      </CityCardList>
      <SelectButton
        disabled={selected === null}  
        onClick={() => {
          if (selected !== null) {
            // 1) 선택된 도시 정보 꺼내기
            const chosenCity = cityList[selected];
            //    여기엔 key, img, desc 값이 들어 있습니다:
            //    chosenCity = { key:"서울특별시", img:"…", desc:"…" }

            // 2) navigate로 Recommendation2 컴포넌트로 이동
            //    state 객체로 선택된 도시 정보와 userName을 함께 넘겨 줍니다.
            navigate("/recommend-abstract", { state: { city: chosenCity, name: userName } });
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