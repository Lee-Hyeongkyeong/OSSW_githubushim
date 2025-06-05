/* RecommendationGridMain.jsx */
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

/* 고정 탭(카테고리) – 필요하면 늘리세요 */
const TABS      = ["전체", "식당", "문화", "액티비티", "힐링", "기타"];
const PAGE_SIZE = 9;   // 그리드 3×3 한 화면

export default function RecommendationGridMain() {
  /* ─────────────────── ① 이전 화면에서 넘겨준 값 ─────────────────── */
  const { state } = useLocation();
  const cityName       = state?.city || "서울특별시";
  const userName       = state?.name || "Unknown User";
  const allItems       = state?.items || [];
  const initialCategory = state?.category || "전체";

  /* ─────────────────── ② 서버에서 받아온 데이터 상태 ─────────────────── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ─────────────────── ③ UI 상태(탭·페이지) ─────────────────── */
  const [tab, setTab] = useState(initialCategory);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  /* ─────────────────── ④ 마운트 시 한 번 콘텐츠 요청 ─────────────────── */
  // useEffect와 setItems, fetch 관련 코드 완전히 삭제

  /* ─────────────────── ⑤ 탭 필터링 & 페이지 슬라이스 ─────────────────── */
  const TAG_TO_CATEGORY = {
    "맛집": "식당",
    "카페": "식당",
    "음식": "식당",
    "액티비티": "액티비티",
    "레포츠": "액티비티",
    "체험": "액티비티",
    "축제": "축제",
    "페스티벌": "축제",
    "전시": "문화",
    "공연": "문화",
    "미술관": "문화",
    "박물관": "문화",
    "역사": "문화",
    "문화": "문화",
    "힐링": "힐링",
    "휴양지": "힐링",
    "공원": "힐링",
    "기타": "기타",
  };

  const filteredItems = React.useMemo(() => {
    if (tab === "전체") return allItems;
    return allItems.filter(item =>
      item.tags?.some(tag => TAG_TO_CATEGORY[tag] === tab)
    );
  }, [allItems, tab]);

  const totalPage  = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems  = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ─────────────────── ⑥ 렌더링 ─────────────────── */
  return (
    <Main>
      <h2>{cityName} 추천 장소</h2>
      <TabMenu>
        {TABS.map(t => (
          <TabItem
            key={t}
            $active={t === tab}
            onClick={() => setTab(t)}
          >
            {t}
          </TabItem>
        ))}
      </TabMenu>
      <SearchAdd>+ 검색 조건 추가</SearchAdd>
      {filteredItems.length === 0 ? (
        <p>표시할 콘텐츠가 없습니다.</p>
      ) : (
        <ImageGrid>
          {filteredItems.map((c, i) => (
            <ImageCard key={i}>
              <ImageThumb
                src={c.img || c.firstimage || "https://via.placeholder.com/300?text=No+Image"}
                alt={c.title}
              />
              <div style={{textAlign:'center',marginTop:'8px',fontWeight:'bold'}}>{c.title}</div>
            </ImageCard>
          ))}
        </ImageGrid>
      )}
    </Main>
  );
}

/* ─────────────────── styled-components ─────────────────── */
const Main          = styled.main`
  width:100%;min-height:70vh;display:flex;flex-direction:column;align-items:center;
  background:#fff;padding:0 0 40px;
`;
const TabMenu       = styled.nav`
  width:100%;max-width:700px;display:flex;justify-content:center;gap:36px;
  margin:32px 0 18px;
  flex-wrap:wrap;
`;
const TabItem       = styled.button`
  background:none;border:none;font-size:1.25rem;font-weight:bold;cursor:pointer;
  color:${({$active})=> $active? "#FFA033":"#888"};
  border-bottom:${({$active})=> $active? "4px solid #FFA033":"none"};
  padding:6px 0 8px;transition:color .2s;
`;
const SearchAdd     = styled.div`
  width:100%;max-width:700px;font-size:1.18rem;margin:18px 0 36px;color:#222;
  font-weight:500;text-align:left;
`;
const ImageGrid     = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:36px;
  width:100%;max-width:700px;margin:0 auto 48px;justify-items:center;
  @media (max-width:600px){grid-template-columns:repeat(2,1fr);gap:18px;}
`;
const ImageCard     = styled.div`
  width:180px;height:180px;border-radius:12px;overflow:hidden;background:#eee;
  display:flex;align-items:center;justify-content:center;
`;
const ImageThumb    = styled.img`
  width:100%;height:100%;object-fit:cover;display:block;
`;
const Pagination    = styled.div`
  width:100%;max-width:700px;display:flex;justify-content:center;align-items:center;
  gap:80px;margin-top:18px;font-size:1.25rem;
`;
const PageButton    = styled.button`
  background:none;border:none;color:#111;font-size:1.18rem;font-weight:bold;
  cursor:pointer;:hover:not(:disabled){color:#FFA033;}
  :disabled{opacity:.4;cursor:not-allowed;}
`;
const PageNumber    = styled.span`
  font-size:1.3rem;font-weight:bold;color:#111;
`;
const MoreButton    = styled.button`
  background:none;border:none;color:#111;font-size:1.18rem;font-weight:bold;
  cursor:pointer;:hover:not(:disabled){color:#FFA033;}
  :disabled{opacity:.4;cursor:not-allowed;}
  margin-top:18px;
`;
