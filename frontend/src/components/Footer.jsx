import React from 'react';
import styled from 'styled-components';

const OS_ITEMS = [
  {
    name: 'GitHub',
    url: 'https://github.com/',
    logo: (
      <img
        src="https://velog.velcdn.com/images/ryu4219/post/47dfe9c2-7438-410a-ab60-257243260eb1/image.png"
        alt="GitHub"
        style={{height: 50, borderRadius: 25}}
      />
    ),
  },
  {
    name: 'TourAPI4.0',
    url: 'https://api.visitkorea.or.kr/#/useApi',
    logo: (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAAAtCAIAAABnBL3QAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjRmNDBiODItZjA5OS0yNjRhLWI1N2MtZGY4ZWE0ZWM1NzNlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBDOTA3QzFFM0Q0QTExRUM5NDExOTFEM0M4RTY1Qjg4IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBDOTA3QzFEM0Q0QTExRUM5NDExOTFEM0M4RTY1Qjg4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ2ZmU1YzllLTBjNGMtYjI0YS04YmMzLTkyNzAyODhhNzQyMCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRiMjZkZWEzLWYyZTktNjg0Yi1iZGJmLTk1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"
        alt="TourAPI4.0"
        style={{height: 40, borderRadius: 25}}
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
        style={{height: 30, borderRadius: 25}}
      />
    ),
  },
];

const Footer = () => {
  return (
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
      <INTRO>
        <div>developed by 깃허부심</div>
        <div>오픈소스 01분반 팀원들 여기 잠들다 살려줘</div>
      </INTRO>
      <CopyRightBar>
        <CopyRight>©2024. TRIPPICK. All Rights Reserved.</CopyRight>
      </CopyRightBar>
    </Foot>
  );
};

const Foot = styled.nav`
padding: 10px;
marginTop: 35px;
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
marginBottom: 16px;
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
  img {
    display: block;
  }
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
