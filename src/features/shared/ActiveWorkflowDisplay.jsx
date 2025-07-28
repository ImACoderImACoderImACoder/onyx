import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import PrideText from "../../themes/PrideText";
import WorkflowItemTypes from "../../constants/enums";
import { DEGREE_SYMBOL } from "../../constants/temperature";
import {
  convertToFahrenheitFromCelsius,
  convertToCelsiusFromFahrenheit,
} from "../../services/utils";
import { cancelCurrentWorkflow } from "../../services/bleQueueing";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.backgroundColor};
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${(props) => (props.isExiting ? fadeOut : fadeIn)} 0.3s ease-out;
  animation-fill-mode: forwards;
  opacity: ${(props) => (props.isExiting ? 0 : 1)};
  pointer-events: ${(props) => (props.isExiting ? "none" : "auto")};
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  
  /* Add subtle pattern overlay */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 20% 80%, 
      ${(props) => props.theme.buttonActive?.backgroundColor || props.theme.primaryColor || "#ff6b35"}08 0%, 
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%, 
      ${(props) => props.theme.buttonActive?.backgroundColor || props.theme.primaryColor || "#ff6b35"}05 0%, 
      transparent 50%
    );
    pointer-events: none;
    z-index: -1;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  position: relative;
  padding: 12px 75px 12px 30px; /* Right padding for buttons */
  box-sizing: border-box;
  
  /* Desktop/Large screens - utilize vertical space better */
  @media (min-width: 769px) {
    flex-direction: column;
    align-items: center;
    gap: 25px;
    height: auto;
    min-height: 200px;
    padding: 30px 75px 30px 30px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    flex-direction: row;
    align-items: center;
    gap: 15px;
    height: 85px;
    padding: 10px 70px 10px 20px;
  }
  
  /* Small/Mobile screens - compact horizontal layout */
  @media (max-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 75px;
    padding: 8px 60px 8px 15px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    flex: 1;
    min-width: 180px;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    flex: 1;
    min-width: 120px;
  }
`;

const WorkflowTitle = styled.h2`
  margin: 0 0 3px 0;
  line-height: 1.1;
  word-break: break-word;
  font-weight: 600;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    font-size: clamp(1.4rem, 3vw, 2rem);
    text-align: center;
    margin: 0 0 8px 0;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 0 0 1px 0;
  }
`;

const StepTitle = styled.h3`
  margin: 0;
  line-height: 1.1;
  opacity: 0.8;
  font-weight: 500;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    text-align: center;
    margin: 0 0 5px 0;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: clamp(0.8rem, 2vw, 1rem);
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    width: 100%;
    gap: 20px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    flex: 2;
    min-width: 150px;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    flex: 1;
    min-width: 100px;
  }
`;

const CompactProgressContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 3px;
  overflow: hidden;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    max-width: 500px;
    height: 8px;
    margin: 15px 0;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    max-width: 300px;
    height: 5px;
    margin-top: 5px;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    max-width: 120px;
    height: 3px;
    margin-top: 2px;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    gap: 20px;
    margin-top: 10px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    gap: 8px;
    margin-top: 8px;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    gap: 4px;
    margin-top: 4px;
    justify-content: space-around;
    flex: 1;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${(props) => {
    // Dramatic color progression for fan operations
    if (props.isDramatic && props.timeRemaining <= 5) {
      const remaining = props.timeRemaining || 0;
      if (remaining <= 1) return "#ff0000"; // Critical red
      if (remaining <= 3) return "#ff6b35"; // Warning red
      if (remaining <= 5) return "#ff9500"; // Orange warning
    }
    return props.theme.buttonActive?.backgroundColor || 
           props.theme.primaryColor || 
           props.theme.primaryFontColor || "#ff6b35";
  }};
  width: ${(props) => props.progress}%;
  transition: width 0.1s ease, background 0.2s ease;
  border-radius: 4px;
  
  ${(props) => props.isDramatic && props.timeRemaining <= 1 && `
    box-shadow: 0 0 10px #ff000080;
    animation: progressPulse 0.5s ease-in-out infinite alternate;
  `}
  
  @keyframes progressPulse {
    from {
      box-shadow: 0 0 10px #ff000080;
    }
    to {
      box-shadow: 0 0 20px #ff0000ff;
    }
  }
`;

// Removed unused styled components (InfoGrid, InfoCard, InfoLabel, InfoValue)

const TimerDisplay = styled.div`
  font-weight: 700;
  text-align: center;
  margin: 0;
  font-family: ${(props) => props.theme.digitalFontFamily || "'Courier New', monospace"};
  color: ${(props) => {
    // Dramatic color changes for final countdown
    if (props.isDramatic && props.timeRemaining <= 5 && props.timeRemaining > 3) {
      return "#ff9500"; // Orange warning
    } else if (props.isDramatic && props.timeRemaining <= 3 && props.timeRemaining > 1) {
      return "#ff6b35"; // Red warning  
    } else if (props.isDramatic && props.timeRemaining <= 1) {
      return "#ff0000"; // Critical red
    }
    return props.theme.buttonActive?.backgroundColor || 
           props.theme.primaryColor || 
           props.theme.primaryFontColor;
  }};
  text-shadow: ${(props) => {
    // Enhanced glow effect for dramatic countdown
    if (props.isDramatic && props.timeRemaining <= 5) {
      const intensity = props.timeRemaining <= 1 ? "15px" : "10px";
      const color = props.timeRemaining <= 1 ? "#ff0000" : "#ff6b35";
      return `0 0 ${intensity} ${color}80, 0 0 20px ${color}40`;
    }
    return `0 0 8px ${props.theme.buttonActive?.backgroundColor || 
                      props.theme.primaryColor || "#ff6b35"}40`;
  }};
  letter-spacing: 0.1em;
  transition: all 0.1s ease-out;
  
  ${(props) => props.isDramatic && props.timeRemaining <= 1 && `
    animation: criticalPulse 0.5s ease-in-out infinite alternate;
  `}
  
  @keyframes criticalPulse {
    from {
      transform: scale(1);
      text-shadow: 0 0 15px #ff000080, 0 0 20px #ff000040;
    }
    to {
      transform: scale(1.04);
      text-shadow: 0 0 20px #ff0000ff, 0 0 30px #ff000080;
    }
  }
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    font-size: clamp(2.5rem, 5vw, 4rem);
    margin: 10px 0;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: clamp(1.4rem, 4vw, 2.2rem);
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 2px 0;
  }
`;

const CompactInfoCard = styled.div`
  text-align: center;
  background: ${(props) => props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
  border: 1px solid ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    padding: 15px 20px;
    min-width: 100px;
    border-radius: 8px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    padding: 6px 10px;
    min-width: 65px;
    flex-shrink: 0;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    padding: 3px 4px;
    min-width: 50px;
    border-radius: 3px;
    flex: 1;
    max-width: 70px;
    height: 32px;
    font-size: 0.75rem;
  }
`;

const CompactLabel = styled.div`
  opacity: 0.7;
  margin-bottom: 1px;
  font-weight: 500;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: 0.65rem;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    font-size: 0.55rem;
    margin-bottom: 0px;
  }
`;

const CompactValue = styled.div`
  font-weight: 600;
  line-height: 1;
  font-family: ${(props) => props.theme.digitalFontFamily || "'Courier New', monospace"};
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Desktop/Large screens */
  @media (min-width: 769px) {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    min-width: 80px;
  }
  
  /* Medium screens */
  @media (max-width: 768px) and (min-width: 481px) {
    font-size: clamp(0.7rem, 1.8vw, 0.9rem);
    min-width: 55px;
  }
  
  /* Small/Mobile screens */
  @media (max-width: 480px) {
    font-size: 0.6rem;
    min-width: 40px;
  }
`;

// Removed unused styled components (ActionButtons, ActionButton)

const ActionButtonsContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 3px;
  z-index: 20;
`;

const MinimizeButton = styled.button`
  background: linear-gradient(145deg, ${(props) => props.theme.buttonColorMain || "rgba(255, 255, 255, 0.1)"}, ${(props) => props.theme.buttonColorMain || "rgba(255, 255, 255, 0.1)"}cc);
  border: 1px solid ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.2)"};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 0.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 35px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(145deg, ${(props) => props.theme.hoverBackgroundColor || props.theme.primaryColor || props.theme.buttonColorMain}, ${(props) => props.theme.hoverBackgroundColor || props.theme.primaryColor || props.theme.buttonColorMain}cc);
    transform: scale(1.1);
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(145deg, rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.6));
  border: 1px solid rgba(220, 53, 69, 0.6);
  color: #ffffff;
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 0.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 30px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(145deg, rgba(220, 53, 69, 1), rgba(220, 53, 69, 0.8));
    transform: scale(1.1);
  }
`;

// Removed LoopIndicator - now shown inline in left section

export default function ActiveWorkflowDisplay({ isVisible, onClose }) {
  const executingWorkflow = useSelector((state) => state.workflow);
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );
  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  const isF = useSelector((state) => state.settings.isF);
  const fanOnGlobalValue = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal
  );
  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

  const currentStepId = executingWorkflow?.currentWorkflowStepId || "";
  const currentWorkflow = executingWorkflow?.currentWorkflow;
  const isWorkflowExecuting = currentStepId && currentWorkflow;

  // Timer is now handled by the hidden CurrentWorkflowExecutionDisplay component in MinimalistLayout
  // This prevents timer conflicts and ensures consistent timing

  if (!isVisible || !isWorkflowExecuting) {
    return null;
  }

  // Extract workflow information
  const workflowName = currentWorkflow.name;
  const currentStep = currentWorkflow.payload[currentStepId - 1];
  const stepType = currentStep.type;
  const payload = currentStep.payload;

  // Calculate total steps (excluding loops and exit conditions)
  const totalSteps = currentWorkflow.payload.filter(
    (item) =>
      ![
        WorkflowItemTypes.LOOP_FROM_BEGINNING,
        WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS,
      ].includes(item.type)
  ).length;

  // Check if workflow has loop
  const hasLoop = currentWorkflow.payload.some(
    (item) => item.type === WorkflowItemTypes.LOOP_FROM_BEGINNING
  );

  // Get step display name and determine countdown duration
  let stepDisplayName = "N/A";
  let stepDurationSeconds = null; // The expected duration for countdown

  switch (stepType) {
    case WorkflowItemTypes.FAN_ON:
      stepDisplayName = "Fan On";
      stepDurationSeconds = payload;
      break;
    case WorkflowItemTypes.FAN_ON_GLOBAL:
      stepDisplayName = "Fan On (Global)";
      stepDurationSeconds = fanOnGlobalValue;
      break;
    case WorkflowItemTypes.HEAT_OFF:
      stepDisplayName = "Turning Heat Off";
      break;
    case WorkflowItemTypes.HEAT_ON:
      if (payload > 0) {
        stepDisplayName = `Heating to ${
          isF
            ? `${convertToFahrenheitFromCelsius(payload)}${DEGREE_SYMBOL}F`
            : `${payload}${DEGREE_SYMBOL}C`
        }`;
      } else {
        stepDisplayName = "Heat On";
      }
      break;
    case WorkflowItemTypes.SET_LED_BRIGHTNESS:
      stepDisplayName = `Set LED Brightness to ${payload}`;
      break;
    case WorkflowItemTypes.WAIT:
      stepDisplayName = "Waiting";
      stepDurationSeconds = payload;
      break;
    case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS:
      const heatStep = payload.conditions?.find(
        (x) => x.nextTemp === targetTemperature
      );

      if (heatStep) {
        const currentTempC = isF
          ? convertToCelsiusFromFahrenheit(currentTemperature)
          : currentTemperature;
        const targetTempC = heatStep.nextTemp;

        if (currentTempC >= targetTempC && heatStep.wait > 0) {
          stepDisplayName = `Waiting at ${
            isF
              ? convertToFahrenheitFromCelsius(heatStep.nextTemp)
              : heatStep.nextTemp
          }${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
          stepDurationSeconds = heatStep.wait;
        } else {
          stepDisplayName = `Heating to ${
            isF
              ? convertToFahrenheitFromCelsius(heatStep.nextTemp)
              : heatStep.nextTemp
          }${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
        }
      } else {
        const defaultTemp = payload.default?.temp;
        const currentTempC = isF
          ? convertToCelsiusFromFahrenheit(currentTemperature)
          : currentTemperature;

        if (currentTempC >= defaultTemp && payload.default.wait > 0) {
          stepDisplayName = `Waiting at ${
            isF
              ? convertToFahrenheitFromCelsius(defaultTemp)
              : defaultTemp
          }${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
          stepDurationSeconds = payload.default.wait;
        } else {
          stepDisplayName = `Heating to ${
            isF
              ? convertToFahrenheitFromCelsius(defaultTemp)
              : defaultTemp
          }${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
        }
      }
      break;
    case WorkflowItemTypes.LOOP_FROM_BEGINNING:
      stepDisplayName = "Looping to Start";
      break;
    default:
      stepDisplayName = "Processing...";
  }

  // Format timer display with dramatic precision for fan operations
  const formatTime = (seconds, showDecimals = false) => {
    const mins = Math.floor(seconds / 60);
    const wholeSecs = Math.floor(seconds % 60);
    const decimals = Math.floor((seconds % 1) * 10);
    
    if (showDecimals) {
      // Dramatic countdown format: "0:05.3"
      return `${mins.toString().padStart(2, "0")}:${wholeSecs
        .toString()
        .padStart(2, "0")}.${decimals}`;
    } else {
      // Standard format: "0:05"
      return `${mins.toString().padStart(2, "0")}:${wholeSecs
        .toString()
        .padStart(2, "0")}`;
    }
  };
  
  // Determine if we should show dramatic decimal countdown
  const isFanOperation = stepType === WorkflowItemTypes.FAN_ON || 
                        stepType === WorkflowItemTypes.FAN_ON_GLOBAL;

  // Calculate countdown (for timed steps only)
  const hasCountdown = stepDurationSeconds !== null && stepDurationSeconds > 0;
  const timeRemaining = hasCountdown 
    ? Math.max(0, stepDurationSeconds - currentTimeInSeconds)
    : null;

  // Progress calculation
  const progress = (currentStepId / totalSteps) * 100;

  // Temperature display values
  const displayCurrentTemp = isF
    ? Math.round(convertToFahrenheitFromCelsius(currentTemperature))
    : Math.round(currentTemperature);
  const displayTargetTemp = isF
    ? Math.round(convertToFahrenheitFromCelsius(targetTemperature))
    : Math.round(targetTemperature);
  const tempSuffix = `${DEGREE_SYMBOL}${isF ? "F" : "C"}`;

  const handleCancel = () => {
    cancelCurrentWorkflow();
    onClose();
  };

  return (
    <FullScreenOverlay>
      <ActionButtonsContainer>
        <MinimizeButton onClick={onClose}>
          <PrideText text="−" />
        </MinimizeButton>
        <CancelButton onClick={handleCancel}>
          <PrideText text="✕" />
        </CancelButton>
      </ActionButtonsContainer>
      

      <ContentContainer>
        {/* Left Section - Workflow Info */}
        <LeftSection>
          <WorkflowTitle>
            <PrideText text={workflowName} />
          </WorkflowTitle>
          <StepTitle>
            <PrideText text={stepDisplayName} />
          </StepTitle>
          <div style={{ 
            fontSize: "0.7rem", 
            opacity: 0.7, 
            marginTop: "2px"
          }}>
            <PrideText text={`Step ${currentStepId}/${totalSteps}`} />
            {hasLoop && <span style={{ marginLeft: "6px" }}>🔄 Loop</span>}
          </div>
        </LeftSection>

        {/* Center Section - Timer, Progress & Info Cards */}
        <CenterSection>
          {hasCountdown && (
            <TimerDisplay 
              isDramatic={isFanOperation} 
              timeRemaining={timeRemaining}
            >
              <PrideText text={formatTime(timeRemaining, isFanOperation)} />
            </TimerDisplay>
          )}
          
          <CompactProgressContainer>
            <ProgressBar 
              progress={progress} 
              isDramatic={isFanOperation} 
              timeRemaining={timeRemaining}
            />
          </CompactProgressContainer>

          {/* Info Cards below progress bar */}
          <RightSection>
            <CompactInfoCard>
              <CompactLabel>
                <PrideText text="Current" />
              </CompactLabel>
              <CompactValue>
                <PrideText text={`${displayCurrentTemp}${tempSuffix}`} />
              </CompactValue>
            </CompactInfoCard>

            <CompactInfoCard>
              <CompactLabel>
                <PrideText text="Target" />
              </CompactLabel>
              <CompactValue>
                <PrideText text={`${displayTargetTemp}${tempSuffix}`} />
              </CompactValue>
            </CompactInfoCard>

            <CompactInfoCard>
              <CompactLabel>
                <PrideText text="Elapsed" />
              </CompactLabel>
              <CompactValue>
                <PrideText text={formatTime(currentTimeInSeconds, isFanOperation)} />
              </CompactValue>
            </CompactInfoCard>
          </RightSection>
        </CenterSection>
      </ContentContainer>
    </FullScreenOverlay>
  );
}

ActiveWorkflowDisplay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};