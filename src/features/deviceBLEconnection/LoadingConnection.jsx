import styled, { keyframes } from "styled-components";
import PrideText from "../../themes/PrideText";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.backgroundColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const LoadingCard = styled.div`
  background: ${(props) =>
    props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 36px;
    width: 95%;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const createColorCycleKeyframes = (theme) => keyframes`
  0% {
    background: ${theme.primaryColor || theme.primaryFontColor};
    border-color: ${theme.primaryColor || theme.primaryFontColor}40;
    box-shadow: 0 0 12px ${theme.primaryColor || theme.primaryFontColor}30;
  }
  25% {
    background: ${theme.primaryFontColor || '#ffffff'};
    border-color: ${theme.primaryFontColor || '#ffffff'}40;
    box-shadow: 0 0 16px ${theme.primaryFontColor || '#ffffff'}35;
  }
  50% {
    background: ${theme.iconColor || theme.primaryFontColor};
    border-color: ${theme.iconColor || theme.primaryFontColor}40;
    box-shadow: 0 0 20px ${theme.iconColor || theme.primaryFontColor}40;
  }
  75% {
    background: ${theme.borderColor || 'rgba(255, 255, 255, 0.8)'};
    border-color: ${theme.borderColor || 'rgba(255, 255, 255, 0.8)'}40;
    box-shadow: 0 0 16px ${theme.borderColor || 'rgba(255, 255, 255, 0.8)'}35;
  }
  100% {
    background: ${theme.primaryColor || theme.primaryFontColor};
    border-color: ${theme.primaryColor || theme.primaryFontColor}40;
    box-shadow: 0 0 12px ${theme.primaryColor || theme.primaryFontColor}30;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 32px;
  border: 3px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-top: 3px solid
    ${(props) => props.theme.primaryColor || props.theme.primaryFontColor};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 24px;
  }
`;

const LoadingTitle = styled.h1`
  margin: 0 0 16px 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: ${(props) => props.theme.primaryFontColor};

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const LoadingDescription = styled.p`
  margin: 0 0 24px 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${(props) => props.theme.primaryFontColor};
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const StatusDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: ${(props) =>
    props.theme.primaryColor || props.theme.primaryFontColor};
  animation: 
    ${pulse} 1.5s ease-in-out infinite,
    ${(props) => createColorCycleKeyframes(props.theme)} 4s ease-in-out infinite;
  animation-delay: 
    ${(props) => props.delay || "0s"},
    ${(props) => props.colorDelay || "0s"};
  opacity: 0.9;
  transition: all 0.4s ease;
`;

const ConnectionSteps = styled.div`
  text-align: left;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.primaryFontColor};
  opacity: 0.7;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepIcon = styled.span`
  font-size: 1rem;
`;

export default function LoadingConnection() {
  return (
    <Container>
      <LoadingCard>
        <LoadingIcon />

        <LoadingTitle>
          <PrideText text="🔗 Connecting to Volcano" />
        </LoadingTitle>

        <LoadingDescription>
          Establishing secure Bluetooth connection with your Volcano Hybrid.
          This may take a few moments...
        </LoadingDescription>

        <StatusIndicator>
          <StatusDot delay="0s" colorDelay="0s" />
          <StatusDot delay="0.2s" colorDelay="1s" />
          <StatusDot delay="0.4s" colorDelay="2s" />
        </StatusIndicator>

        <ConnectionSteps>
          <StepItem>
            <StepIcon>🔒</StepIcon>
            Establishing secure connection
          </StepItem>
          <StepItem>
            <StepIcon>📡</StepIcon>
            Scanning for Volcano device characteristics
          </StepItem>
          <StepItem>
            <StepIcon>⚡</StepIcon>
            Initializing device communication
          </StepItem>
        </ConnectionSteps>
      </LoadingCard>
    </Container>
  );
}
