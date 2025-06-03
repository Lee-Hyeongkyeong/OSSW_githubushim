import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/pic/trippick-logo-white.png';

// 구글 로고(공식 SVG)
const GoogleIcon = () => (
  <img src="https://img.icons8.com/?size=512&id=17949&format=png" width="22" height="22" viewBox="0 0 48 48" style={{ marginRight: 12 }}>
  </img>
);

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Nav>
        <Home to="/">
          <LogoImg src={logo} alt="로고" />
        </Home>
        <Menu>
          <NavItem to="/about">트립픽?</NavItem>
          <NavItem to="/survey-main">취향 알기</NavItem>
          <NavItem to="/recommend-city">For you</NavItem>
          <LoginButton type="button" onClick={() => setModalOpen(true)}>
            Login
          </LoginButton>
        </Menu>
      </Nav>
      {modalOpen && (
        <ModalBackdrop onClick={() => setModalOpen(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>SNS 로그인</ModalTitle>
            <GoogleLoginBtn
              onClick={() => {
                // 구글 로그인 로직 연결
                alert('구글 로그인!');
              }}
            >
              <GoogleIcon />
              Google Login
            </GoogleLoginBtn>
            <ModalClose onClick={() => setModalOpen(false)}>닫기</ModalClose>
          </ModalBox>
        </ModalBackdrop>
      )}
    </>
  );
};

const Nav = styled.nav`
  background-color: #FFA033;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 42px;
  font-family: 'PretendardVariable';
`;

const Home = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  color: white;
  text-decoration: none;
`;

const LogoImg = styled.img`
  height: 38px;
  object-fit: contain;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 38px;
`;

const NavItem = styled(Link)`
  font-size: 1.13rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  background-color: #fff;
  color: #FFA033;
  border: none;
  border-radius: 50px;
  padding: 10px 32px;
  font-weight: bold;
  font-size: 1.13rem;
  cursor: pointer;
  margin-left: 18px;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
`;

// --- Modal 스타일 ---
const ModalBackdrop = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.32);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  min-width: 340px;
  max-width: 90vw;
  padding: 36px 32px 30px 32px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ModalTitle = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 24px;
  align-self: flex-start;
`;

const GoogleLoginBtn = styled.button`
  width: 260px;
  height: 48px;
  background: #fff;
  color: #222;
  border: 1.5px solid #ddd;
  border-radius: 6px;
  font-size: 1.13rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: #f7f7f7;
    box-shadow: 0 4px 16px rgba(66,133,244,0.12);
  }
`;

const ModalClose = styled.button`
  margin-top: 8px;
  background: none;
  border: none;
  color: #FFA033;
  font-size: 1.1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default Navbar;
