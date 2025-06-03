import React from 'react';
import styled from 'styled-components';
import img1 from '../assets/pic/about-1.png';
import img2 from '../assets/pic/about-2.png';
import icon from '../assets/pic/chatbot.png';

const About = () => {
  return (
    <Container>
        <MainSection>
            <IntroIcon src={icon}></IntroIcon>
            <IntroText>
                <IntroTitle>TRIPPICK: 떠나자, 나답게</IntroTitle>
                <IntroDesc>
                여기는 트립픽! 설명 넣을거야 우아아앙<br />
                참고로 트립픽 가제임 당 자연어 아직 확정 아님 그냥 그렇다구,,
                </IntroDesc>
            </IntroText>
        </MainSection>
        <ImageBanner>
            <MainImg src={img1} />
        </ImageBanner>
        <ContentSection>
            <ContentTitle>당신의 여행 스타일은 무엇입니까?</ContentTitle>
            <ContentText>
            TRIPPICK은 J 3명과 P 1명으로 이루어진 팀원들의 여행 경험에서 출발해 만들어진 시스템입니다. 여행을 떠날 때, 우리는 어떤 과정을 거칠까요? J는 가고 싶은 여행지를 선택하면 거기서 방문할 곳이나 가고 싶은 음식점 등을 미리 서칭해보고 계획을 세운 후 여행을 떠나죠. 반면에 P는 여행을 떠난 후, 산책을 하고 싶다면 근처에 있는 공원을 찾아보고, 밥을 먹고 싶다면 길을 거닐다 발견한 음식점, 혹은 근처 맛집을 찾아 방문합니다. 우리는 생각했습니다. J와 P 모두를 만족시킬만한 여행 시스템을 만들 수는 없을까?
            </ContentText>
        </ContentSection>
        <RowSection>
            <SubImg src={img2} />
            <RowTextBox>
            <ContentTitle>J와 P를 모두 만족시킬 수 있는 여행 시스템</ContentTitle>
            <ContentText>
                우리는 J와 P를 모두 만족시킬 수 있는 여행 시스템을 개발하고자 했습니다. 사용자의 설문조사를 통해 사용자의 취향을 파악한 후, 여행 API 데이터를 기반으로 3개의 도시를 매칭해줍니다. 이중에서 사용자가 도시 하나를 선택하면, J를 위해 이번 여행 코스에 넣을 만한 다양한 음식점이나 관광지 등을 제시합니다. J는 이를 참고해 우리 시스템을 이용하는 것만으로 해당 도시에 대한 다양한 관광지를 비롯한 많은 여행지를 파악할 수 있습니다. P에게는 언제나 시스템에서 보이는 챗봇을 통해 즉석에서 여행지를 추천받을 수 있습니다. 챗봇은 사용자의 GPS와 데이터를 기반으로 질문에 대답해줍니다. J와 P 모두를 만족시킬 수 있는 시스템을 만들어낸 것입니다.
            </ContentText>
            </RowTextBox>
        </RowSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
`;

const MainSection = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 150px 50px;
    gap: 30px;
`;

const IntroIcon = styled.img`
  width: 100px;
  height: 100px;
`;

const IntroText = styled.div``;

const IntroTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const IntroDesc = styled.div`
  color: #222222;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const ImageBanner = styled.div`
  width: 100%;
  margin: 32px 0 24px 0;
`;

const MainImg = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

const ContentSection = styled.section`
    text-align: center;
    margin: 50px 20px;
    padding: 0 18px;
`;

const ContentTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ContentText = styled.div`
  color: #222222;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 150px;
`;

const RowSection = styled.section`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 32px;
    margin: 50px 20px;
    padding: 0 18px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SubImg = styled.img`
  width: 35%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

const RowTextBox = styled.div`
    flex: 1;
    min-width: 220px;
    margin-bottom: 100px;
`;

export default About;



// import React from 'react';
// import styled from 'styled-components';

// const About = () => {
//     return (
//         <MAIN>
//            <div>lalala</div>
//         </MAIN>
//     );
// };

// const MAIN = styled.nav`
//     background-color: rgb(239, 245, 243);
//     display: flex;
//     justify-content: space-around;
//     padding: 160px 65px;
// `;

// export default About;