import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/pic/trippick-logo-white.png';

// //구글 로고(공식 SVG)
// const GoogleIcon = () => (
//   <img src="https://img.icons8.com/?size=512&id=17949&format=png" width="22" height="22" viewBox="0 0 48 48" style={{ marginRight: 12 }}>
//   </img>
// );

const Navbar = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 팝업에서 메시지 수신
  useEffect(() => {
    const handleMessage = (event) => {
      // 보안을 위해 origin 체크 필요 (실서비스에서는 event.origin 체크)
      if (event.data && event.data.type === "LOGIN_SUCCESS") {
        setIsLoggedIn(true);
        setModalOpen(false); // 모달 닫기
      }
    };
    window.addEventListener("message", handleMessage);
    // 클린업
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 로그인 상태 확인(새로고침 시에도 유지)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("https://127.0.0.1:5000/api/auth/check", {
          method: "GET",
          credentials: "include",
          headers: {
            "Accept": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to check login status");
        }

        const data = await response.json();
        console.log("Login check response:", data);
        
        setIsLoggedIn(data.loggedIn);
        if (data.loggedIn) {
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        // 에러가 발생해도 로그인 상태를 변경하지 않음
      }
    };

    checkLoginStatus();
  }, []);

  const handleGoogleLogin = () => {
    const popup = window.open(
      "https://127.0.0.1:5000/", // 백엔드 OAuth 엔드포인트
      "googleLogin",
      "width=500,height=600"
    );

    // 팝업에서 인증 완료 후, window.opener.postMessage로 부모 창에 결과 전달 가능
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://127.0.0.1:5000") return;
      
      if (event.data && event.data.type === "LOGIN_SUCCESS") {
        setIsLoggedIn(true);
        setModalOpen(false);
      }
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("https://127.0.0.1:5000/logout", {
        method: "GET",
        credentials: "include",
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        setIsLoggedIn(false);
        alert("로그아웃이 완료됐습니다.");
      } else {
        const data = await res.json();
        alert(`로그아웃에 실패했습니다. (${data.message || res.status})`);
      }
    } catch (e) {
      console.error("Logout error:", e);
      alert("네트워크 오류로 로그아웃에 실패했습니다.");
    }
  };

  const handleForYouClick = async (e) => {
    e.preventDefault();
    
    try {
      // 먼저 로그인 상태 확인
      const authResponse = await fetch("https://127.0.0.1:5000/api/auth/check", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });

      const authData = await authResponse.json();
      
      if (!authData.loggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      // 로그인된 경우에만 설문 이력 확인
      const response = await fetch("https://127.0.0.1:5000/api/survey/history", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("설문 이력을 확인할 수 없습니다.");
      }

      const data = await response.json();
      
      if (!data.hasHistory) {
        alert("아직 설문을 진행하지 않았습니다. 설문을 먼저 진행해주세요.");
        navigate("/survey-main");
      } else {
        navigate("/recommendation");
      }
    } catch (error) {
      console.error("Error checking survey history:", error);
      if (error.message.includes('Failed to fetch')) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert(error.message || '설문 이력을 확인할 수 없습니다.');
      }
    }
  };

  return (
    <Nav>
      <Home to="/">
        <LogoImg src={logo} alt="로고" />
      </Home>
      <Menu>
        <NavItem to="/about">트립픽?</NavItem>
        <NavItem to="/survey-main">취향 알기</NavItem>
        <NavItem to="/recommend-city" 
        // onClick={handleForYouClick}
        >
        For you</NavItem>
        <NavAuth>
          {isLoggedIn ? (
            <LoginButton onClick={handleLogout}>
              Logout
            </LoginButton>
          ) : (
            <LoginButton onClick={handleGoogleLogin}>
              Login
            </LoginButton>
          )}
        </NavAuth>
      </Menu>
    </Nav>
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
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;

const NavAuth = styled.div`
  display: flex;
  align-items: center;
`;

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
