import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import chatbot from '../assets/pic/chatbot.png';


// 임의의 플로팅 버튼 로고
const floatingLogo = chatbot;

// 임의의 상대방/사용자 정보
const USER = {
  name: "나",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};
const PARTNER = {
  name: "챗봇",
  avatar: chatbot
};

const initialMessages = [
  { id: 1, user: "partner", text: "안녕하세요! 무엇을 도와드릴까요?" },
  // { id: 2, user: "user", text: "안녕하세요! 여행 추천 받고 싶어요." },
  // { id: 3, user: "partner", text: "원하시는 지역이 있으신가요?" }
];

const FloatingChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // 채팅창 열릴 때마다 스크롤 맨 아래로
  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), user: "user", text: input }
    ]);
    setInput("");
    // 실제 API 연동 시 여기서 서버로 메시지 전송
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <FloatingButton onClick={() => setOpen(true)}>
        <img src={floatingLogo} alt="chat" />
      </FloatingButton>
      {open && (
        <ChatModalBackdrop onClick={() => setOpen(false)}>
          <ChatModal onClick={e => e.stopPropagation()}>
            <ChatHeader>
              <Avatar src={PARTNER.avatar} alt="상대" />
              <HeaderName>{PARTNER.name}</HeaderName>
              <CloseBtn onClick={() => setOpen(false)}>×</CloseBtn>
            </ChatHeader>
            <ChatBody>
              {messages.map(msg => (
                <MsgRow key={msg.id} $isUser={msg.user === "user"}>
                  {(msg.user === "partner") && <AvatarMini src={PARTNER.avatar} alt="상대" />}
                  <MsgBubble $isUser={msg.user === "user"}>
                    {msg.text}
                  </MsgBubble>
                  {(msg.user === "user") && <AvatarMini src={USER.avatar} alt="나" />}
                </MsgRow>
              ))}
              <div ref={chatEndRef} />
            </ChatBody>
            <ChatInputBox>
              <ChatInput
                placeholder="메시지를 입력하세요"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendBtn onClick={handleSend}>전송</SendBtn>
            </ChatInputBox>
          </ChatModal>
        </ChatModalBackdrop>
      )}
    </>
  );
};

// --- 스타일드 컴포넌트 ---

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
  background: ${({ $isUser }) => ($isUser ? "#ffa033" : "#fff")};
  color: ${({ $isUser }) => ($isUser ? "#fff" : "#222")};
  border-radius: 16px;
  padding: 10px 16px;
  font-size: 1.08rem;
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  word-break: break-word;
`;

const ChatInputBox = styled.div`
  display: flex;
  align-items: center;
  border-top: 1.5px solid #eee;
  padding: 10px 12px;
  background: #fff;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  margin-right: 10px;
  outline: none;
`;

const SendBtn = styled.button`
  background: #ffa033;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.03rem;
  padding: 9px 18px;
  cursor: pointer;
  transition: background 0.17s;
  &:hover {
    background: #ffb755;
  }
`;

export default FloatingChat;
