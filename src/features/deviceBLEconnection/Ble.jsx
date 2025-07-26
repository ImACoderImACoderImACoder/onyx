import styled from "styled-components";
import { useState } from "react";
import PrideText from "../../themes/PrideText";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const LargeConnectButton = styled.button`
  background: ${(props) =>
    props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
  border: 2px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 20px;
  padding: 60px 48px;
  color: ${(props) => props.theme.primaryFontColor};
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60vh;
  width: 98%;
  max-width: 1000px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    border-color: ${(props) =>
      props.theme.buttonActive?.borderColor || props.theme.primaryColor};
  }

  &:active {
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    padding: 48px 36px;
    min-height: 50vh;
    width: 96%;
    gap: 20px;
  }
`;

const ConnectTitle = styled.h1`
  margin: 0;
  font-size: 3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ConnectDescription = styled.p`
  margin: 0;
  font-size: 1.3rem;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 500px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ConnectInstruction = styled.div`
  font-size: 1.1rem;
  opacity: 0.7;
  margin-top: 8px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProTipCard = styled.div`
  background: ${(props) =>
    props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 96%;
    max-width: none;
  }
`;

const ProTipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ProTipLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProTipIcon = styled.span`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const ProTipTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.primaryColor || props.theme.primaryFontColor};
`;

const ProTipNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled.button`
  background: ${(props) =>
    props.theme.buttonColorMain || "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.2)"};
  border-radius: 6px;
  padding: 6px 8px;
  color: ${(props) => props.theme.primaryFontColor};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.theme.buttonActive?.backgroundColor || props.theme.primaryColor};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      transform: none;
      background: ${(props) =>
        props.theme.buttonColorMain || "rgba(255, 255, 255, 0.1)"};
    }
  }
`;

const TipCounter = styled.span`
  font-size: 0.8rem;
  opacity: 0.6;
  min-width: 40px;
  text-align: center;
`;

const ProTipContent = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: ${(props) => props.theme.primaryFontColor};
  background: ${(props) =>
    props.theme.buttonColorMain || "rgba(255, 255, 255, 0.05)"};
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 120px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    min-height: 100px;
  }
`;

export default function Ble(props) {
  const tips = [
    "Spacebar toggles the fan",
    "Setting the screen to 0 brightness turns it off",
    "Don't forget to clean your herb chamber :D",
    "Remember to check your Volcano's air filter",
    "You can change the look of the app by changing themes in the settings page",
    "Use workflows to take full control of your Volcano",
    "You can add or remove temperatures in the settings page",
    "Frequent users should replace bags every 2-4 weeks for optimal flavor",
    "10 minutes or less is the ideal time for a bag to store vapor",
    "For best results preheat the chamber for 2-5 seconds before attaching the bag",
    "Drag and drop can be used to reorder workflows and workflow items on all devices",
    "If you want to visually see the last workflow run you can enable highlight last run workflow in settings",
    "The Auto Seasonal Rotate theme selects a festive theme when it can and falls back on a semi-random theme",
    "New workflow commands out now! Loop your workflows and set the temperature based off the current target temp!",
    'Mini mode available now! Just click "Mini Mode" in the nav menu!',
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(
    Math.floor(Math.random() * tips.length)
  );

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Container>
      <MainContent>
        <LargeConnectButton onClick={props.onClick}>
          <ConnectTitle>
            <PrideText text="🔗 Connect to Volcano" />
          </ConnectTitle>
          <ConnectDescription>
            Ready to take control of your Volcano Hybrid? Tap here to establish
            a Bluetooth connection and unlock all the advanced features.
          </ConnectDescription>
          <ConnectInstruction>
            Make sure your Volcano is powered on and nearby
          </ConnectInstruction>
        </LargeConnectButton>

        <ProTipCard>
          <ProTipHeader>
            <ProTipLeft>
              <ProTipIcon>💡</ProTipIcon>
              <ProTipTitle>
                <PrideText text="Pro Tip" />
              </ProTipTitle>
            </ProTipLeft>
            <ProTipNavigation>
              <NavButton onClick={prevTip} title="Previous tip">
                ←
              </NavButton>
              <TipCounter>
                {currentTipIndex + 1}/{tips.length}
              </TipCounter>
              <NavButton onClick={nextTip} title="Next tip">
                →
              </NavButton>
            </ProTipNavigation>
          </ProTipHeader>
          <ProTipContent>
            <PrideText text={tips[currentTipIndex]} />
          </ProTipContent>
        </ProTipCard>
      </MainContent>
    </Container>
  );
}
