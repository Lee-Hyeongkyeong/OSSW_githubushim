import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import chatbotImg from "../assets/pic/chatbot.png";
import userImg from "../assets/pic/userImg.png";
import API_CONFIG from "../config/api";
import { keyframes } from "styled-components";

/* 점 세 개가 번갈아 깜빡이는 애니메이션 */
const blink = keyframes`
  0%, 20%  { opacity: 0; }
  40%      { opacity: 1; }
  60%      { opacity: 0; }
  80%,100% { opacity: 1; }
`;

/* 점 하나 */
const Dot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-left: 3px;
  border-radius: 50%;
  background: currentColor;
  animation: ${blink} 1.2s infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

/* “…“ 전체 묶음 */
const LoadingDots = () => (
  <>
    <Dot delay={0} />
    <Dot delay={0.2} />
    <Dot delay={0.4} />
  </>
);

// axios 기본 설정
axios.defaults.baseURL = API_CONFIG.CHATBOT_BASE_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-USER-ID"] = "test-user-id";

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "partner",
      text: "안녕하세요! 저는 트립이에요 👋\n어떤 장소를 원하시나요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationError, setLocationError] = useState(null);

  /* // ----- MORE RECOMMENDATIONS -----  (주석 처리)
  const [currentMessage, setCurrentMessage] = useState("");
  const [displayedPlaceIds, setDisplayedPlaceIds] = useState(new Set());
  */
  // “더 많은 장소” 기능이 사라졌으므로 displayedPlaceIds를 단순 지역 변수로만 사용
  const displayedPlaceIds = useRef(new Set());

  const chatEndRef = useRef(null);
  const [loadingDots, setLoadingDots] = useState("");

  // 로딩 애니메이션
  useEffect(() => {
    let iv;
    if (isLoading) {
      iv = setInterval(() => {
        setLoadingDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 500);
    } else setLoadingDots("");
    return () => clearInterval(iv);
  }, [isLoading]);

  // 위치 가져오기
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => setLocationError(err.message)
    );
  }, []);

  // 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------
  // 1) 첫 요청 (is_more_request: false)
  // -------------------------------
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!location.latitude) {
      const errMsg = locationError
        ? `위치 오류: ${locationError}`
        : "위치 정보를 가져오는 중입니다.";
      return setMessages((m) => [
        ...m,
        { id: Date.now(), user: "partner", text: errMsg },
      ]);
    }

    // 사용자 메시지 추가 & 초기화
    setMessages((m) => [...m, { id: Date.now(), user: "user", text: input }]);
    /* // ----- MORE RECOMMENDATIONS -----  (주석 처리)
    setCurrentMessage(input);
    setDisplayedPlaceIds(new Set()); // 이전 추천 초기화
    */
    displayedPlaceIds.current = new Set();
    setInput("");
    setIsLoading(true);

    // 검색중 표시
    const loadingMsg = {
      id: Date.now() + 1,
      user: "partner",
      text: "장소를 탐색하고 있습니다.",
      loading: true 
    };
    setMessages((m) => [...m, loadingMsg]);

    try {
      const { data } = await axios.post("/chat", {
        latitude: location.latitude,
        longitude: location.longitude,
        user_input: input,
        displayed_place_ids: Array.from(displayedPlaceIds.current),
        is_more_request: false, // <-- 처음엔 false
      });

      console.log(data.recommendations);

      // 로딩 메시지 제거
      setMessages((m) => m.filter((x) => x.id !== loadingMsg.id));

      // 추천 결과 처리
      if (data.recommendations?.length) {
        const newIds = data.recommendations.map((r) => r.place_id);
        displayedPlaceIds.current = new Set([
          ...displayedPlaceIds.current,
          ...newIds,
        ]);

        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 2,
            user: "partner",
            text: "추천 장소를 찾았어요!",
            recommendations: data.recommendations,
          },
          /* // ----- MORE RECOMMENDATIONS -----  (주석 처리)
          {
            id: Date.now() + 3,
            user: "partner",
            text: "더 많은 장소를 추천받으시겠어요?",
            showMoreButton: true,
          },
          */
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            id: Date.now(),
            user: "partner",
            text: "조건에 맞는 장소를 찾지 못했습니다.",
          },
        ]);
      }
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== loadingMsg.id));
      setMessages((m) => [
        ...m,
        {
          id: Date.now(),
          user: "partner",
          text: "서버 연결 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* // --------------------------------
  // 2) 추가 요청 (is_more_request: true)
  // --------------------------------
  // ----- MORE RECOMMENDATIONS -----  (주석 처리)
  const handleMoreRecommendations = async () => { ... }
  */

  // 렌더링
  return (
    <>
      <FloatingButton onClick={() => setOpen(true)}>
        <img src={chatbotImg} alt="chat" />
      </FloatingButton>
      {open && (
        <ChatModalBackdrop onClick={() => !isLoading && setOpen(false)}>
          <ChatModal onClick={(e) => e.stopPropagation()}>
            <ChatHeader>
              <Avatar src={chatbotImg} alt="트립이" />
              <HeaderName>트립이</HeaderName>
              <CloseBtn onClick={() => setOpen(false)}>×</CloseBtn>
            </ChatHeader>

            <ChatBody>
              {messages.map((msg) => (
                <MsgRow key={msg.id} $isUser={msg.user === "user"}>
                  {msg.user === "partner" && <AvatarMini src={chatbotImg} />}
                  <MsgBubble $isUser={msg.user === "user"}>
                      {msg.loading ? (             // ← 로딩용 메시지라면
                        <>
                          장소를 탐색하고 있습니다
                          <LoadingDots />           {/* ← 점점점 애니메이션 */}
                        </>
                      ) : (
                        msg.text                   // ← 일반 메시지는 그대로 출력
                      )}
                    {msg.recommendations?.map((r, i) => (
                      <PlaceCard key={i}>
                        <PlaceTitle>{r.title}</PlaceTitle>
                        <PlaceInfo>📍 {r.address}</PlaceInfo>
                        <PlaceInfo>⭐ {r.rating}</PlaceInfo>
                        <PlaceInfo>📏 {r.distance}m</PlaceInfo>
                        <PlaceInfo>⏱️ {r.transit_time}</PlaceInfo>
                        <DirectionsButton
                          href={r.directions_url}
                          target="_blank"
                        >
                          🚌 길찾기
                        </DirectionsButton>
                      </PlaceCard>
                    ))}

                    {/* // ----- MORE RECOMMENDATIONS -----  (주석 처리)
                    {msg.showMoreButton && (
                      <MoreButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: Date.now(),
                              user: "user",
                              text: "더 많은 장소 추천받기",
                            },
                          ]);
                          handleMoreRecommendations();
                        }}
                        disabled={isLoading}
                      >
                        더 많은 장소 추천받기
                      </MoreButton>
                    )}
                    */}
                  </MsgBubble>
                  {msg.user === "user" && <AvatarMini src={userImg} />}
                </MsgRow>
              ))}
              <div ref={chatEndRef} />
            </ChatBody>

            <ChatInputBox>
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isLoading ? "검색 중..." : "메시지를 입력하세요."}
              />
              <SendBtn onClick={handleSend} disabled={isLoading} />
            </ChatInputBox>
          </ChatModal>
        </ChatModalBackdrop>
      )}
    </>
  );
};

// ----------------------------------
// 이하 styled-components 정의부 …
// ----------------------------------


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
