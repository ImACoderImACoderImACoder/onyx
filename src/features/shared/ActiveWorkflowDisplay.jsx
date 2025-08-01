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
import CurrentTemperature from "../deviceInteraction/CurrentTemperature/CurrentTemperature";
import CurrentTargetTemperature from "../deviceInteraction/CurrentTargetTemperature/CurrentTargetTemperature";

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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  padding: 8px 55px 8px 8px;
  overflow: hidden;
`;

const SimpleHeader = styled.div`
  flex: 0 0 auto;
  text-align: center;
  padding: 4px 0 8px 0;
`;

const WorkflowName = styled.h1`
  margin: 0;
  font-size: clamp(1.1rem, 4vw, 1.6rem);
  font-weight: 600;
  line-height: 1.1;
  word-break: break-word;
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(16px, 4vh, 32px);
  padding: 0;
`;

const TimerArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 2vh, 16px);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: clamp(280px, 80vw, 500px);
  gap: clamp(16px, 4vw, 24px);
`;

const ProgressCircle = styled.div`
  position: relative;
  width: clamp(50px, 12vw, 70px);
  height: clamp(50px, 12vw, 70px);
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .circle-bg {
    fill: none;
    stroke: ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
    stroke-width: 3;
  }

  .circle-progress {
    fill: none;
    stroke: ${(props) => 
      props.theme.buttonActive?.backgroundColor || 
      props.theme.primaryColor || "#ff6b35"
    };
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.3s ease;
  }
`;

const ProgressNumber = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  text-align: center;
  font-size: clamp(0.7rem, 2.5vw, 0.9rem);
  line-height: 1;
  color: ${(props) => props.theme.primaryFontColor};
`;

const StepDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const CurrentStep = styled.div`
  font-weight: 600;
  font-size: clamp(0.8rem, 2.8vw, 1rem);
  line-height: 1.2;
  word-break: break-word;
  hyphens: auto;
`;

const LoopIndicator = styled.div`
  font-size: clamp(0.6rem, 2vw, 0.75rem);
  opacity: 0.7;
  font-weight: 500;
`;

const TemperatureDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 1.5vh, 12px);
  flex: 1;
  min-width: 0;

  & > div {
    font-size: clamp(1rem, 3vw, 1.3rem) !important;
    margin-bottom: 0 !important;
    line-height: 1.1 !important;

    div {
      font-size: clamp(1rem, 3vw, 1.3rem) !important;
      line-height: 1.1 !important;
    }

    span {
      font-size: clamp(0.7rem, 2.2vw, 0.9rem) !important;
      line-height: 1.1 !important;
    }
  }
`;

// Removed unused styled components (InfoGrid, InfoCard, InfoLabel, InfoValue)

const TimerDisplay = styled.div`
  font-weight: 700;
  text-align: center;
  margin: 0;
  font-family: ${(props) => props.theme.digitalFontFamily || "'Courier New', monospace"};
  line-height: 0.85;
  letter-spacing: 0.05em;
  
  /* Small horizontal screens - smaller timer */
  @media (max-height: 500px) and (min-width: 600px) {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
  
  /* All other screens */
  @media not ((max-height: 500px) and (min-width: 600px)) {
    font-size: clamp(2rem, 10vw, 4rem);
  }
  color: ${(props) => {
    // When counting up (elapsed time), always use normal theme colors
    if (props.isCountingUp) {
      return props.theme.primaryFontColor;
    }
    // Only apply dramatic colors to actual countdowns
    if (props.hasCountdown && props.timeRemaining <= 5 && props.timeRemaining > 3) {
      return "#ff9500";
    } else if (props.hasCountdown && props.timeRemaining <= 3 && props.timeRemaining > 1) {
      return "#ff6b35";
    } else if (props.hasCountdown && props.timeRemaining <= 1) {
      return "#ff0000";
    }
    return props.theme.buttonActive?.backgroundColor || 
           props.theme.primaryColor || 
           props.theme.primaryFontColor;
  }};
  text-shadow: ${(props) => {
    // When counting up (elapsed time), use subtle theme-based glow
    if (props.isCountingUp) {
      return `0 0 8px ${props.theme.primaryColor || props.theme.primaryFontColor}20`;
    }
    // Only apply dramatic glow to actual countdowns
    if (props.hasCountdown && props.timeRemaining <= 5) {
      const intensity = props.timeRemaining <= 1 ? "15px" : "10px";
      const color = props.timeRemaining <= 1 ? "#ff0000" : "#ff6b35";
      return `0 0 ${intensity} ${color}80, 0 0 20px ${color}40`;
    }
    return `0 0 8px ${props.theme.buttonActive?.backgroundColor || 
                      props.theme.primaryColor || "#ff6b35"}40`;
  }};
  transition: all 0.1s ease-out;
  
  ${(props) => props.hasCountdown && !props.isCountingUp && props.timeRemaining <= 1 && `
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

  // Format timer display with dramatic precision for all countdowns
  const formatTime = (seconds, showDecimals = false) => {
    const mins = Math.floor(seconds / 60);
    const wholeSecs = Math.floor(seconds % 60);
    const decimals = Math.floor((seconds % 1) * 10);
    
    if (showDecimals) {
      // Dramatic countdown format with decimals: "0:05.3"
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
        {/* Simple Header */}
        <SimpleHeader>
          <WorkflowName>
            <PrideText text={workflowName} />
          </WorkflowName>
        </SimpleHeader>

        {/* Main Section */}
        <MainSection>
          {/* Timer Display */}
          <TimerArea>
            <TimerDisplay 
              hasCountdown={hasCountdown}
              timeRemaining={hasCountdown ? timeRemaining : null}
              isCountingUp={!hasCountdown}
            >
              <PrideText text={
                hasCountdown 
                  ? formatTime(timeRemaining, hasCountdown)
                  : formatTime(currentTimeInSeconds, false)
              } />
            </TimerDisplay>
          </TimerArea>

          {/* Info Row */}
          <InfoRow>
            <ProgressCircle>
              <svg viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle-progress"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <ProgressNumber>
                <PrideText text={hasLoop ? "∞" : `${currentStepId}`} />
              </ProgressNumber>
            </ProgressCircle>
            
            <StepDetails>
              <CurrentStep>
                <PrideText text={stepDisplayName} />
              </CurrentStep>
              {hasLoop && (
                <LoopIndicator>
                  <PrideText text="∞ Loop Mode" />
                </LoopIndicator>
              )}
            </StepDetails>
            
            <TemperatureDisplay>
              <CurrentTemperature
                currentTemperature={displayCurrentTemp}
                temperatureSuffix={tempSuffix}
              />
              
              <CurrentTargetTemperature
                currentTargetTemperature={displayTargetTemp}
                temperatureSuffix={tempSuffix}
              />
            </TemperatureDisplay>
          </InfoRow>
        </MainSection>
      </ContentContainer>
    </FullScreenOverlay>
  );
}

ActiveWorkflowDisplay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};