import React from 'react';
import styled from 'styled-components';

const OS_ITEMS = [
  {
    name: 'GitHub',
    url: 'https://github.com/Lee-Hyeongkyeong/OSSW_githubushim/tree/main',
    logo: (
      <img
        src="https://velog.velcdn.com/images/ryu4219/post/47dfe9c2-7438-410a-ab60-257243260eb1/image.png"
        alt="GitHub"
        style={{ height: 50, borderRadius: 25 }}
      />
    ),
  },
  {
    name: 'TourAPI4.0',
    url: 'https://api.visitkorea.or.kr/#/',
    logo: (
      <img
        src={"https://raw.githubusercontent.com/YourUser/YourRepo/main/src/assets/pic/tourapi-logo.png"}
        alt="TourAPI4.0"
        style={{ height: 40, borderRadius: 25 }}
      />
    ),
  },
  {
    name: '한국관광 데이터랩',
    url: 'https://datalab.visitkorea.or.kr/',
    logo: (
      <img
        src="https://datalab.visitkorea.or.kr/images/portal/common/logo-landscape.svg"
        alt="한국관광 데이터랩"
        style={{ height: 30, borderRadius: 25 }}
      />
    ),
  },
];

const THIRD_PARTY_APIS = [
  {
    name: 'OpenAI API',
    url: 'https://platform.openai.com/',
    logo: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/04/OpenAI_Logo.svg"
        alt="OpenAI"
        style={{ height: 40 }}
      />  
    ), 
  },
  {
    name: 'Google Maps API',
    url: 'https://developers.google.com/maps',
    logo: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Maps_icon_%282020%29.svg/1024px-Google_Maps_icon_%282020%29.svg.png"
        alt="Google Maps"
        style={{ height: 40 }}
      />
    ),
  },
  {
    name: 'Naver Maps API',
    url: 'https://navermaps.github.io/maps.js.ncp/',
    logo: (
      <img
        src="https://navermaps.github.io/maps.js/docs/tutorial-1-map-simple.example.html"
        alt="Naver Maps"
        style={{ height: 40 }}
      />
    ),
  },
];

const Footer = () => (
  <Foot>
    <OSINFO>
      <OShead>Open Source data used in this website</OShead>
      <OSItemList>
        {OS_ITEMS.map(item => (
          <OSitem
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.logo}
          </OSitem>
        ))}
      </OSItemList>
    </OSINFO>

    <APIINFO>
      <APIhead>Third-Party APIs used in this website</APIhead>
      <APIItemList>
        {THIRD_PARTY_APIS.map(api => (
          <APIitem
            key={api.name}
            href={api.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {api.logo}
          </APIitem>
        ))}
      </APIItemList>
    </APIINFO>

    <INTRO>
      <div>developed by 깃허부심</div>
      <div>오픈소스 01분반 팀원들 여기 잠들다 살려줘</div>
    </INTRO>
    <CopyRightBar>
      <CopyRight>©2025. TRIPPICK. All Rights Reserved.</CopyRight>
    </CopyRightBar>
  </Foot>
);

const Foot = styled.nav`
  padding: 10px;
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFA033;
  gap: 35px;
`;

const OSINFO = styled.nav`
  width: 80%;
  margin: 15 auto;
  font-size: 14px;
`;

const OShead = styled.div`
  padding: 25px 0;
  font-weight: bold;
  font-size: 20px;
`;

const OSItemList = styled.nav`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`;

const OSitem = styled.a`
  background-color: #FFFFFF;
  height: 50px;
  width: 300%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: #222;
  font-weight: 500;
  font-size: 1.07rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.18s, background 0.18s;
  &:hover {
    background: #e0e0e0;
    box-shadow: 0 4px 16px rgba(255,160,51,0.10);
    text-decoration: underline;
  }
  img { display: block; }
`;

const APIINFO = styled.nav`
  width: 80%;
  margin: 15 auto;
  font-size: 14px;
`;

const APIhead = styled.div`
  padding: 25px 0;
  font-weight: bold;
  font-size: 20px;
`;

const APIItemList = styled.nav`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`;

const APIitem = styled.a`
  background-color: #FFFFFF;
  height: 50px;
  width: 300%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: #222;
  font-weight: 500;
  font-size: 1.07rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.18s, background 0.18s;
  &:hover {
    background: #e0e0e0;
    box-shadow: 0 4px 16px rgba(255,160,51,0.10);
    text-decoration: underline;
  }
  img { display: block; }
`;

const INTRO = styled.div`
  font-size: 11px;
  display: flex;
  flex-direction: column;
`;

const CopyRightBar = styled.div`
  width: 100%;
  background: #FFA033;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 15px;
  color: #fff;
`;

const CopyRight = styled.div`
  font-size: 14px;
`;

export default Footer;
