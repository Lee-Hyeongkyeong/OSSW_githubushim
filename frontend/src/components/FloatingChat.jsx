/**
 * TODO 리스트:
 * 1. currentMessage: 추가 추천 버튼 메시지 재사용을 위한 상태
 * 2. displayedPlaceIds: 추천 장소 메시지 추가를 위한 상태
 * 3. handleMoreRecommendations: 추가 추천 기능 구현
 * 4. handleSend 내 displayedPlaceIds 초기화: 새로운 메시지 입력 시 이전 추천 장소 목록 초기화
 * 
 * 이와 관련된 코드들은 MVP에 작성되지 않은 '장소 추가 추천 기능'으로, 추후 사용자 경험 개선을 위해 구현할 예정입니다.
 */

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import chatbotImg from "../assets/pic/chatbot.png";

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:5000/api/chatbot';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-USER-ID'] = 'test-user-id';

// FloatingChat 컴포넌트: 챗봇의 메인 컴포넌트
const FloatingChat = () => {
  // 상태 관리
  const [open, setOpen] = useState(false); // 챗봇 창의 열림/닫힘 상태
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "partner",
      text: "안녕하세요! 저는 트립이에요 👋\n  언제, 어디서나 원하는 장소를 찾아드려요.\n어떤 장소를 원하시나요?"
    }
  ]); // 대화 메시지 목록
  const [input, setInput] = useState(""); // 사용자 입력 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // 사용자 위치 정보
  const [locationError, setLocationError] = useState(null); // 위치 정보 오류
  const [currentMessage, setCurrentMessage] = useState(""); // 현재 메시지
  const [displayedPlaceIds, setDisplayedPlaceIds] = useState(new Set()); // 이미 표시된 장소 ID 목록
  const chatEndRef = useRef(null); // 채팅창 스크롤을 위한 ref

  // 로딩 애니메이션을 위한 상태
  const [loadingDots, setLoadingDots] = useState("");

  // 로딩 애니메이션 효과
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 500);
    } else {
      setLoadingDots("");
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // 위치 정보 가져오기
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error("위치 정보 오류:", error);
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // 채팅창 스크롤 자동 이동
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 메시지 전송 처리
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 위치 정보 확인
    if (!location.latitude || !location.longitude) {
      const errorMsg = locationError 
        ? `위치 정보 오류: ${locationError}`
        : "위치 정보를 가져오는 중입니다. 잠시만 기다려주세요.";
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: "partner",
        text: errorMsg
      }]);
      return;
    }

    const userMsg = { id: Date.now(), user: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setCurrentMessage(input);
    setDisplayedPlaceIds(new Set());
    setInput("");
    setIsLoading(true);

    // 검색 중 메시지 추가
    const searchingMsg = {
      id: Date.now() + Math.random(),
      user: "partner",
      text: "장소를 탐색하고 있습니다."
    };
    setMessages(prev => [...prev, searchingMsg]);

    try {
      console.log("API 요청 시작:", {
        latitude: location.latitude,
        longitude: location.longitude,
        user_input: input
      });

      const response = await axios.post('/chat', {
        latitude: location.latitude,
        longitude: location.longitude,
        user_input: input,
        displayed_place_ids: Array.from(displayedPlaceIds)
      });

      console.log("API 응답:", response.data);

      // 검색 중 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== searchingMsg.id));

      if (response.data && response.data.recommendations && response.data.recommendations.length > 0) {
        // 새로운 추천 장소들의 ID를 displayedPlaceIds에 추가
        const newPlaceIds = response.data.recommendations.map(place => place.place_id);
        setDisplayedPlaceIds(prev => new Set([...prev, ...newPlaceIds]));

        // 추천 장소 메시지 추가
        const recommendationsMsg = {
          id: Date.now() + Math.random(),
          user: "partner",
          text: "추천 장소를 찾았어요!",
          recommendations: response.data.recommendations
        };
        setMessages(prev => [...prev, recommendationsMsg]);

        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          user: "partner",
          text: "더 많은 장소를 추천받으시겠어요?",
          showMoreButton: true
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          user: "partner",
          text: "죄송합니다. 조건에 맞는 장소를 찾지 못했습니다."
        }]);
      }
    } catch (error) {
      // 검색 중 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== searchingMsg.id));

      console.error("API Error:", error);
      let errorMessage = "서버 연결 중 오류가 발생했습니다.";
      
      if (error.response) {
        // 서버가 응답을 반환한 경우
        console.error("서버 응답:", error.response.data);
        errorMessage = `서버 오류: ${error.response.data.error || error.response.statusText}`;
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error("서버 응답 없음:", error.request);
        errorMessage = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.";
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error("요청 설정 오류:", error.message);
        errorMessage = `요청 오류: ${error.message}`;
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: "partner",
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // (todo-list: 추가 추천 버튼 메시지 추가)
  const handleMoreRecommendations = async () => {
    if (isLoading || !currentMessage) return;

    // (todo-list: 사용자 메시지 추가 (currentMessage 재사용))
    const userMsg = { id: Date.now(), user: "user", text: currentMessage };
    setMessages(prev => [...prev, userMsg]);

    setIsLoading(true);

    // 검색 중 메시지 추가
    const searchingMsg = {
      id: Date.now() + Math.random(),
      user: "partner",
      text: "장소를 탐색하고 있습니다."
    };
    setMessages(prev => [...prev, searchingMsg]);

    try {
      const response = await axios.post('/chat', {
        latitude: location.latitude,
        longitude: location.longitude,
        user_input: currentMessage,
        displayed_place_ids: Array.from(displayedPlaceIds)
      });

      // 검색 중 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== searchingMsg.id));

      if (response.data && response.data.recommendations && response.data.recommendations.length > 0) {
        // (todo-list: 새로운 추천 장소들의 ID를 displayedPlaceIds에 추가)
        const newPlaceIds = response.data.recommendations.map(place => place.place_id);
        setDisplayedPlaceIds(prev => new Set([...prev, ...newPlaceIds]));

        // 추천 장소 메시지 추가
        const recommendationsMsg = {
          id: Date.now() + Math.random(),
          user: "partner",
          text: "추가 장소를 찾았어요!",
          recommendations: response.data.recommendations
        };
        setMessages(prev => [...prev, recommendationsMsg]);

        // (todo-list: 추가 추천 버튼 메시지 추가)
        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          user: "partner",
          text: "더 많은 장소를 추천받으시겠어요?",
          showMoreButton: true
        }]);
      } else { 
        setMessages(prev => [...prev, {
          id: Date.now(),
          user: "partner",
          text: "더 이상 추천할 장소가 없습니다."
        }]);
      }
    } catch (error) {
      // 검색 중 메시지 제거
      setMessages(prev => prev.filter(msg => msg.id !== searchingMsg.id));

      console.error("API Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: "partner",
        text: "서버 연결 중 오류가 발생했습니다."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FloatingButton onClick={() => setOpen(true)}>
        <img src={chatbotImg} alt="chat" />
      </FloatingButton>
      {open && (
        <ChatModalBackdrop onClick={() => !isLoading && setOpen(false)}>
          <ChatModal onClick={e => e.stopPropagation()}>
            <ChatHeader>
              <Avatar src={chatbotImg} alt="상대" />
              <HeaderName>트립이</HeaderName>
              <CloseBtn onClick={() => setOpen(false)}>×</CloseBtn>
            </ChatHeader>
            <ChatBody>
              {messages.map(msg => (
                <MsgRow key={msg.id} $isUser={msg.user === "user"}>
                  {(msg.user === "partner") && <AvatarMini src={chatbotImg} alt="트립이" />}
                  <MsgBubble $isUser={msg.user === "user"}>
                    {msg.text}
                    {msg.text === "장소를 탐색하고 있습니다." && (
                      <LoadingDots>{loadingDots}</LoadingDots>
                    )}
                    {msg.recommendations && msg.recommendations.map((rec, index) => (
                      <PlaceCard key={index}>
                        <PlaceTitle>{rec.title}</PlaceTitle>
                        <PlaceInfo>📍 {rec.address}</PlaceInfo>
                        <PlaceInfo>⭐ {rec.rating}/5</PlaceInfo>
                        <PlaceInfo>📏 {rec.distance}m</PlaceInfo>
                        <PlaceInfo>⏱️ {rec.transit_time}</PlaceInfo>
                        <DirectionsButton 
                          href={rec.directions_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🚌 길찾기
                        </DirectionsButton>
                      </PlaceCard>
                    ))}
                    {msg.showMoreButton && (
                      <MoreButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreRecommendations();
                        }} 
                        disabled={isLoading}
                      >
                        더 많은 장소 추천받기 
                      </MoreButton>
                    )}
                  </MsgBubble>
                  {(msg.user === "user") && <AvatarMini src={chatbotImg} alt="나" />}
                </MsgRow>
              ))}
              <div ref={chatEndRef} />
            </ChatBody>
            <ChatInputBox>
              <ChatInput
                placeholder={isLoading ? "검색 중..." : "메시지를 입력하세요."}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
              />
              <SendBtn onClick={handleSend} disabled={isLoading} />
            </ChatInputBox>
          </ChatModal>
        </ChatModalBackdrop>
      )}
    </>
  );
};

//-------------------------------------------------//
//-----------------스타일드 컴포넌트-----------------//
//-------------------------------------------------//

// 챗봇 실행 버튼
const FloatingButton = styled.button`
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 2000;
  width: 68px;
  height: 68px;
  background: #ffa033;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 6px 32px rgba(255,160,51,0.18);
    transform: scale(1.07);
  }
  img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }
`;

const ChatModalBackdrop = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.22);
  z-index: 2100;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

// 메인 챗봇 창
const ChatModal = styled.div`
  background: #fff;
  border-radius: 18px 18px 0 0;
  width: 370px;
  max-width: 95vw;
  height: 540px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  margin: 0 32px 32px 0;
  @media (max-width: 500px) {
    width: 98vw;
    margin: 0 1vw 1vw 0;
    height: 70vh;
  }
`;

// 채팅 창 상단 헤더더
const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  height: 62px;
  border-bottom: 1.5px solid #eee;
  padding: 0 18px;
  position: relative;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
`;

const HeaderName = styled.div`
  font-size: 1.13rem;
  font-weight: bold;
  color: #222;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 18px;
  top: 16px;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #FFA033;
  cursor: pointer;
`;

// 채팅 창 본문
const ChatBody = styled.div`
  flex: 1;
  padding: 18px 12px;
  background: #fafafa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MsgRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  gap: 8px;
`;

const AvatarMini = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

const MsgBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.$isUser ? "#ffa033" : "#f0f0f0"};
  color: ${props => props.$isUser ? "white" : "black"};
  margin: ${props => props.$isUser ? "0 0 0 auto" : "0 auto 0 0"};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  word-break: break-word;
  line-height: 1.5;
`;

// 채팅 창 하단 입력 박스
const ChatInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
  position: relative;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #f8f8f8;

  &:focus {
    border-color: #ffa033;
    box-shadow: 0 0 0 2px rgba(255, 160, 51, 0.1);
    background: white;
  }

  &::placeholder {
    color: #999;
  }
`;

const SendBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #ffa033;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ffb755;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: "➤";
    font-size: 16px;
    transform: rotate(270deg);
  }
`;

const PlaceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
`;

const PlaceTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const PlaceInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DirectionsButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin-top: 12px;
  background-color: #81C784;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #66BB6A;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const MoreButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: #4DB6AC;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #26A69A;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingDots = styled.span`
  display: inline-block;
  min-width: 24px;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default FloatingChat;