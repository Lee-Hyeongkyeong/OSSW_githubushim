// RecommendationCourseMain.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// 🔸 태그 → 카테고리 매핑
const TAG_TO_CATEGORY = {
  "맛집": "식당",
  "카페": "식당",
  "음식": "식당",

  "액티비티": "액티비티",
  "레포츠": "액티비티",
  "체험": "액티비티",

  "축제": "축제",
  "페스티벌": "축제",
};

const RecommendationCourseMain = () => {
  /** ① RecommendationMain 에서 넘어온 state 추출  */
  const { state } = useLocation();                      // { city:{key,img,desc}, name:"홍길동" }
  const navigate = useNavigate();
  const userName   = state?.name  || "여행자";
  const cityName   = state?.city?.key || "서울특별시";

  /** ② 로컬 상태 */
  const [loading , setLoading ] = useState(true);
  const [error   , setError   ] = useState(null);
  const [groups  , setGroups  ] = useState({            // { "식당":[{…}], "액티비티":[…], ... }
    "식당":[], "액티비티":[], "축제":[]
  });

  /** ③ 마운트 시 한번 호출 */
  useEffect(() => {
    const fetchContents = async () => {
      try{
        const res = await fetch("https://127.0.0.1:5000/api/recommend/contents", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: cityName, top_n: 30 })
        });
        if(!res.ok) throw new Error(`HTTP ${res.status}`);

        const { contents=[] } = await res.json();

        // ③-1. 카테고리별로 분류
        const g = { "식당":[], "액티비티":[], "축제":[] };
        contents.forEach(c => {
          const tag = c.tags?.find(t => TAG_TO_CATEGORY[t]);
          const cat = tag ? TAG_TO_CATEGORY[tag] : null;
          if(cat) g[cat].push(c);
        });
        setGroups(g);
      }catch(err){
        setError(err.message || "데이터를 불러오지 못했습니다.");
      }finally{
        setLoading(false);
      }
    };

    fetchContents();
  }, [cityName]);

  /** ④ 렌더 */
  return (
    <MainContainer>
      <Title>
        <span className="name">{userName}</span> 님을 위한<br/>
        <CityPoint>{cityName} 필수 방문 코스</CityPoint>
      </Title>

      {loading  && <SubTitle>콘텐츠를 불러오는 중…</SubTitle>}
      {error    && <SubTitle>❌ {error}</SubTitle>}

      {!loading && !error &&
        Object.entries(groups).map(([cat, list], idx) => (
          <CategoryBox key={cat}>
            <CategoryTitle>{cat}</CategoryTitle>

            {list.length === 0
              ? <SubTitle>추천 콘텐츠가 없습니다.</SubTitle>
              : <>
                  <ImageRow>
                    {list.slice(0,4).map((c,i) => (
                      <ImageThumb key={i}>
                        <img src={c.img || c.firstimage || "https://via.placeholder.com/300?text=No+Image"} alt={c.title}/>
                      </ImageThumb>
                    ))}
                  </ImageRow>
                  {/* 더보기 버튼 클릭 시 Recommendation3으로 이동, 해당 카테고리 전체 리스트와 도시명, 사용자 이름 전달 */}
                  <MoreButton
                    onClick={() =>
                      navigate("/recommend-detail", {
                        state: {
                          city: cityName,
                          name: userName,
                          category: cat,
                          items: Object.values(groups).flat()
                        }
                      })
                    }
                  >
                    더보기 &gt;
                  </MoreButton>
                </>
            }
          </CategoryBox>
        ))
      }
    </MainContainer>
  );
};

/* ---------- styled-components ↓ (변경 최소) ---------- */

const MainContainer = styled.main`
  width:100%;
  min-height:70vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:44px 0;
  background:#fff;
`;
const Title = styled.h1`
  font-size:2.1rem;
  font-weight:800;
  text-align:center;
  margin-bottom:38px;
  .name{color:#111;}
`;
const CityPoint = styled.span`
  font-size:2.1rem;
  color:#111;`
  ;
const SubTitle  = styled.div`
  font-size:1.1rem;
  color:#555;
  margin:20px 0;`
  ;

const CategoryBox = styled.section`
  width:100%;
  max-width:1100px;
  padding:32px 2vw 22px;
  background:#fafafa;
  border:3px solid #FFA033;
  border-radius:18px;
  margin-bottom:34px;
`;
const CategoryTitle = styled.div`
  font-size:1.45rem;
  font-weight:bold;
  color:#222;
  margin-bottom:18px;
`;
const ImageRow = styled.div`
  display:flex;
  gap:2vw;
  flex-wrap:wrap;
  justify-content:center;
  margin-bottom:18px;
`;
const ImageThumb = styled.div`
  width:22vw;
  min-width:80px;
  max-width:220px;
  aspect-ratio:1/1;
  border-radius:10px;
  overflow:hidden;
  background:#eee;
  img{width:100%;height:100%;object-fit:cover;}
`;
const MoreButton = styled.button`
  align-self:flex-end;
  background:none;
  border:none;
  font-weight:bold;
  cursor:pointer;
  font-size:1.05rem;
  color:#222;
  &:hover{color:#FFA033;text-decoration:underline;}
`;

export default RecommendationCourseMain;
