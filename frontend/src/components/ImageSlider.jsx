// src/components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import img1 from '../assets/pic/home-1.png';

const img2 = 'https://images.unsplash.com/photo-1524598006180-eddbaa4db69d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const img3 = 'https://images.unsplash.com/photo-1602288637781-5ca78e8af9d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const img4 = 'https://images.unsplash.com/photo-1590437084089-9f5ae1500176?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const images = [img1, img2, img3, img4];

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
//  height: 450px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 0.5s;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  ${props => (props.left ? 'left: 16px;' : 'right: 16px;')}
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 2;
`;

function ImageSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = idx => {
    setIndex(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 7000);
  };

  const prev = () => goTo((index - 1 + images.length) % images.length);
  const next = () => goTo((index + 1) % images.length);

  return (
    <SliderContainer>
      {images.map((img, i) => (
        <SlideImage key={i} src={img} alt={`slide${i}`} active={i === index} />
      ))}
      <NavButton left onClick={prev} aria-label="이전">&lt;</NavButton>
      <NavButton onClick={next} aria-label="다음">&gt;</NavButton>
    </SliderContainer>
  );
}

export default ImageSlider;
