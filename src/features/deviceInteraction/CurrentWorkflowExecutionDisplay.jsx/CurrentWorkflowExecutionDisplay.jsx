import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentStepEllapsedTimeInSeconds } from "../../workflowEditor/workflowSlice";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import WorkflowItemTypes from "../../../constants/enums";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import {
  convertToFahrenheitFromCelsius,
  convertToCelsiusFromFahrenheit,
} from "../../../services/utils";
import { useRef } from "react";
import { ActiveButton } from "../WriteTemperature/styledComponents";
import { cancelCurrentWorkflow } from "../../../services/bleQueueing";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";


const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const WorkflowWidget = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 10px;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 0.75s;
`;

const MinimizedButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ExpandedTooltip = styled.div`
  position: fixed;
  top: ${(props) => props.top || "60px"};
  left: ${(props) => props.left || "50%"};
  transform: translateX(-50%);
  background: ${(props) => props.theme.backgroundColor || "rgba(0, 0, 0, 0.9)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 10000;
  min-width: 280px;
  max-width: 400px;
  pointer-events: auto;
  color: ${(props) => props.theme.primaryFontColor};
  animation: ${slideDown} 0.2s ease-out;
  animation-fill-mode: forwards;

  /* Tooltip arrow pointing to minimized button */
  &::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: ${(props) => props.arrowLeft || "50%"};
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-bottom-color: ${(props) =>
      props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: ${(props) => props.arrowLeft || "50%"};
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom-color: ${(props) =>
      props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
    margin-top: 1px;
  }

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    transform: none;

    &::before,
    &::after {
      left: ${(props) => props.arrowLeft || "50%"};
    }
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.isExpanded ? "12px" : "0")};
`;

const WidgetTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const WidgetProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  opacity: 0.8;
`;

const MiniProgressBar = styled.div`
  background: ${(props) =>
    props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 10px;
  height: 4px;
  width: 40px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => (props.current / props.total) * 100}%;
    background: ${(props) =>
      props.theme.primaryColor || props.theme.primaryFontColor};
    border-radius: 10px;
    transition: width 0.3s ease;
  }
`;

const ExpandedDetails = styled.div`
  display: ${(props) => (props.isExpanded ? "block" : "none")};
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.8rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  opacity: 0.7;
  color: ${(props) => props.theme.primaryFontColor};
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.primaryFontColor};
`;

const WidgetActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
`;

const MiniButton = styled.button`
  background: ${(props) =>
    props.theme.buttonColorMain || "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.2)"};
  border-radius: 6px;
  padding: 4px 8px;
  color: ${(props) => props.theme.primaryFontColor};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.theme.buttonActive?.backgroundColor || props.theme.primaryColor};
  }
`;

const WorkflowIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
  color: ${(props) => props.theme.primaryFontColor};
`;

const LoopIndicator = styled.span`
  color: ${(props) => props.theme.iconColor};
  font-size: 0.85em;
  opacity: 0.9;
`;

const CircularProgress = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3.8px solid
      ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.2)"};
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2.8px solid transparent;
    border-top: 2.8px solid
      ${(props) => props.theme.primaryColor || props.theme.primaryFontColor};
    border-radius: 50%;
    transform: rotate(${(props) => (props.progress / 100) * 360}deg);
    transition: transform 0.3s ease;
  }
`;

const CircularProgressText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.primaryFontColor};
  z-index: 1;
`;

const MinimizedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

export default function CurrentWorkflowExecutionDisplay() {
  const executingWorkflow = useSelector((state) => state.workflow);
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );
  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  const isF = useSelector((state) => state.settings.isF);
  const [wasWaiting, setWasWaiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: "60px",
    left: "50%",
    arrowLeft: "50%",
  });
  const containerRef = useRef();
  const buttonRef = useRef();
  const timerStartRef = useRef();
  const dispatch = useDispatch();

  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

  const fanOnGlobalValue = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal
  );

  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  const currentStepId = executingWorkflow?.currentWorkflowStepId || "";
  const currentWorkflow = executingWorkflow?.currentWorkflow;
  const isWorkflowExecuting = currentStepId && currentWorkflow;

  let workflowName = "",
    totalSteps = 0,
    stepType = "N/A",
    showTimer = false,
    expectedTime = "0",
    stepDisplayName = "N/A",
    hasLoop = false;

  if (isWorkflowExecuting) {
    workflowName = currentWorkflow.name;
    stepType = currentWorkflow.payload[currentStepId - 1].type;
    const payload = currentWorkflow.payload[currentStepId - 1].payload;

    // Check if workflow contains a loop
    hasLoop = currentWorkflow.payload.some(
      (item) => item.type === WorkflowItemTypes.LOOP_FROM_BEGINNING
    );
    switch (stepType) {
      case WorkflowItemTypes.FAN_ON:
        stepDisplayName = "Fan on";
        break;
      case WorkflowItemTypes.FAN_ON_GLOBAL:
        stepDisplayName = "Fan on global";
        break;
      case WorkflowItemTypes.HEAT_OFF:
        stepDisplayName = "Turning heat Off";
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
        stepDisplayName = `Wait`;
        break;
      case WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS:
        stepDisplayName = "Check exit condition";
        break;
      case WorkflowItemTypes.LOOP_FROM_BEGINNING:
        stepDisplayName = "Loop";
        break;
      case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS:
        const heatStep = payload.conditions.find(
          (x) => x.nextTemp === targetTemperature
        );

        if (heatStep) {
          const previousHeat = isF
            ? convertToFahrenheitFromCelsius(heatStep.ifTemp)
            : heatStep.ifTemp;
          const nextHeat = isF
            ? convertToFahrenheitFromCelsius(heatStep.nextTemp)
            : heatStep.nextTemp;

          // Check if we've reached target temp and are now waiting
          const currentTempC = isF
            ? convertToCelsiusFromFahrenheit(currentTemperature)
            : currentTemperature;
          const targetTempC = heatStep.nextTemp;

          if (currentTempC >= targetTempC && heatStep.wait > 0) {
            stepDisplayName = `Waiting at ${nextHeat}°${isF ? "F" : "C"}`;
          } else {
            stepDisplayName = `Heating to ${nextHeat}°${isF ? "F" : "C"}`;
          }
        } else {
          const defaultTemp = isF
            ? convertToFahrenheitFromCelsius(payload.default.temp)
            : payload.default.temp;

          // Check if we've reached default temp and are waiting
          const currentTempC = isF
            ? convertToCelsiusFromFahrenheit(currentTemperature)
            : currentTemperature;
          const targetTempC = payload.default.temp;

          if (currentTempC >= targetTempC && payload.default.wait > 0) {
            stepDisplayName = `Waiting at ${defaultTemp}°${isF ? "F" : "C"}`;
          } else {
            stepDisplayName = `Heating to ${defaultTemp}`;
          }
        }

        break;
      default:
        stepDisplayName = "Unknown";
    }
    totalSteps = currentWorkflow.payload.filter(
      (item) =>
        ![
          WorkflowItemTypes.LOOP_FROM_BEGINNING,
          WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS,
        ].includes(item.type)
    ).length;
    showTimer =
      stepType.includes("fan") ||
      stepType.includes("wait") ||
      stepType.includes("heat");

    // For conditional heat, check if we're in waiting mode to show timer
    if (stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
      const payload = currentWorkflow.payload[currentStepId - 1].payload;
      const heatStep = payload.conditions.find(
        (x) => x.nextTemp === targetTemperature
      );

      if (heatStep) {
        const currentTempC = isF
          ? ((currentTemperature - 32) * 5) / 9
          : currentTemperature;
        const targetTempC = isF
          ? ((heatStep.nextTemp - 32) * 5) / 9
          : heatStep.nextTemp;
        showTimer =
          showTimer || (currentTempC >= targetTempC && heatStep.wait > 0);
      } else {
        const currentTempC = isF
          ? ((currentTemperature - 32) * 5) / 9
          : currentTemperature;
        const targetTempC = isF
          ? ((payload.default.temp - 32) * 5) / 9
          : payload.default.temp;
        showTimer =
          showTimer ||
          (currentTempC >= targetTempC && payload.default.wait > 0);
      }
    }

    if (stepType.includes("fan") || stepType.includes("wait")) {
      expectedTime = `${
        stepType === WorkflowItemTypes.FAN_ON_GLOBAL
          ? fanOnGlobalValue
          : currentWorkflow.payload[currentStepId - 1].payload
      } ${
        (stepType === WorkflowItemTypes.FAN_ON_GLOBAL
          ? fanOnGlobalValue
          : currentWorkflow.payload[currentStepId - 1].payload) === 1
          ? "Second"
          : "Seconds"
      }`;
    } else if (stepType.includes("heat")) {
      // Get target temperature for heating steps
      let isWaiting = false;

      if (stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
        const payload = currentWorkflow.payload[currentStepId - 1].payload;
        const heatStep = payload.conditions.find(
          (x) => x.nextTemp === targetTemperature
        );

        if (heatStep) {
          // Check if we're in waiting phase
          const currentTempC = isF
            ? convertToCelsiusFromFahrenheit(currentTemperature)
            : currentTemperature;
          const targetTempC = heatStep.nextTemp;

          if (currentTempC >= targetTempC && heatStep.wait > 0) {
            // We're waiting - show wait time
            expectedTime = `${heatStep.wait} ${
              heatStep.wait === 1 ? "Second" : "Seconds"
            }`;
            isWaiting = true;
          }
        } else {
          // Check if we're in waiting phase for default
          const currentTempC = isF
            ? convertToCelsiusFromFahrenheit(currentTemperature)
            : currentTemperature;
          const targetTempC = payload.default.temp;

          if (currentTempC >= targetTempC && payload.default.wait > 0) {
            // We're waiting - show wait time
            expectedTime = `${payload.default.wait} ${
              payload.default.wait === 1 ? "Second" : "Seconds"
            }`;
            isWaiting = true;
          }
        }
      }

      if (!isWaiting) {
        expectedTime = "N/A";
      }
    } else {
      expectedTime = showTimer ? "N/A" : "";
    }
  }

  // Timer logic moved from TimerEstimate component
  useEffect(() => {
    // Reset the timer start reference when currentTimeInSeconds is 0
    // This handles the case when we manually reset the timer
    if (currentTimeInSeconds === 0) {
      timerStartRef.current = new Date();
    }
  }, [currentTimeInSeconds]);

  useEffect(() => {
    if (!isWorkflowExecuting) return;
    
    timerStartRef.current = new Date();
    
    // Use higher precision timer for dramatic countdown effect (especially for fan operations)
    const interval = setInterval(() => {
      const elapsedMs = new Date() - timerStartRef.current;
      const elapsedSeconds = elapsedMs / 1000;
      
      // Store with decimal precision for dramatic countdown
      dispatch(setCurrentStepEllapsedTimeInSeconds(elapsedSeconds));
    }, 100); // Update every 100ms for smooth countdown

    return () => {
      clearInterval(interval);
      timerStartRef.current = undefined;
    };
  }, [currentStepId, wasWaiting, dispatch, isWorkflowExecuting]);

  // Detect transition from heating to waiting and reset elapsed time
  useEffect(() => {
    if (
      isWorkflowExecuting &&
      stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS
    ) {
      const payload = currentWorkflow.payload[currentStepId - 1].payload;
      const heatStep = payload.conditions?.find(
        (x) => x.nextTemp === targetTemperature
      );

      let isCurrentlyWaiting = false;
      if (heatStep) {
        const currentTempC = isF
          ? convertToCelsiusFromFahrenheit(currentTemperature)
          : currentTemperature;
        const targetTempC = heatStep.nextTemp;
        isCurrentlyWaiting = currentTempC >= targetTempC && heatStep.wait > 0;
      } else if (payload.default) {
        const currentTempC = isF
          ? convertToCelsiusFromFahrenheit(currentTemperature)
          : currentTemperature;
        const targetTempC = payload.default.temp;
        isCurrentlyWaiting =
          currentTempC >= targetTempC && payload.default.wait > 0;
      }

      // If we just transitioned from heating to waiting, reset the timer
      if (isCurrentlyWaiting && !wasWaiting) {
        dispatch(setCurrentStepEllapsedTimeInSeconds(0));
      }

      setWasWaiting(isCurrentlyWaiting);
    }
  }, [
    currentTemperature,
    targetTemperature,
    isF,
    stepType,
    currentWorkflow,
    currentStepId,
    isWorkflowExecuting,
    wasWaiting,
    dispatch,
  ]);

  const location = useLocation();

  // Always expand when workflow starts and calculate position
  useEffect(() => {
    if (isWorkflowExecuting) {
      console.log("Workflow started, expanding widget");
      setIsExpanded(true);

      // Calculate position after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const buttonCenter = rect.left + rect.width / 2;
          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            // On mobile, tooltip spans 20px to (window.innerWidth - 20px)
            // Account for tooltip padding and arrow width for perfect alignment
            const tooltipLeft = 20;
            const tooltipWidth = window.innerWidth - 40; // 20px on each side
            const arrowPositionInTooltip = buttonCenter - tooltipLeft;
            // Add small offset to account for arrow size (6px) and center it perfectly
            const adjustedPosition = arrowPositionInTooltip + 0; // No offset adjustment
            const arrowLeftPercent = Math.max(
              15,
              Math.min((adjustedPosition / tooltipWidth) * 100, 85)
            );

            console.log("Mobile positioning:", {
              buttonCenter,
              tooltipLeft,
              tooltipWidth,
              arrowPositionInTooltip,
              arrowLeftPercent: `${arrowLeftPercent}%`,
            });

            setTooltipPosition({
              top: `${rect.bottom + 8}px`,
              left: `${buttonCenter}px`, // Not used on mobile but kept for consistency
              arrowLeft: `${arrowLeftPercent}%`,
            });
          } else {
            console.log("Desktop positioning:", {
              rect: rect,
              buttonCenter: buttonCenter,
              top: rect.bottom + 8,
              left: buttonCenter,
            });

            setTooltipPosition({
              top: `${rect.bottom + 8}px`,
              left: `${buttonCenter}px`,
              arrowLeft: "50%",
            });
          }
        } else {
          console.log("Button ref not available yet");
        }
      }, 200);
    }
  }, [isWorkflowExecuting]);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !e.target.closest('[data-tooltip="workflow-expanded"]')
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isExpanded]);

  const handleWidgetClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent expansion when clicking on buttons
    if (e.target.closest("button")) return;

    console.log("Widget clicked, buttonRef.current:", buttonRef.current);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenter = rect.left + rect.width / 2;
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Use same mobile calculation as auto-expand
        const tooltipLeft = 20;
        const tooltipWidth = window.innerWidth - 40; // 20px on each side
        const arrowPositionInTooltip = buttonCenter - tooltipLeft;
        const adjustedPosition = arrowPositionInTooltip + 0; // No offset adjustment
        const arrowLeftPercent = Math.max(
          15,
          Math.min((adjustedPosition / tooltipWidth) * 100, 85)
        );

        console.log("Mobile click positioning:", {
          buttonCenter,
          tooltipLeft,
          tooltipWidth,
          arrowPositionInTooltip,
          arrowLeftPercent: `${arrowLeftPercent}%`,
        });

        setTooltipPosition({
          top: `${rect.bottom + 8}px`,
          left: `${buttonCenter}px`, // Not used on mobile but kept for consistency
          arrowLeft: `${arrowLeftPercent}%`,
        });
      } else {
        console.log("Desktop click positioning:", {
          rect: rect,
          buttonCenter: buttonCenter,
          top: rect.bottom + 8,
          left: buttonCenter,
        });

        setTooltipPosition({
          top: `${rect.bottom + 8}px`,
          left: `${buttonCenter}px`,
          arrowLeft: "50%", // Center the arrow in the tooltip
        });
      }
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <WorkflowWidget ref={containerRef} isVisible={isWorkflowExecuting}>
      <MinimizedButton
        ref={buttonRef}
        onClick={handleWidgetClick}
        data-widget-button="true"
      >
        <CircularProgress progress={(currentStepId / totalSteps) * 100}>
          <CircularProgressText>
            {isWorkflowExecuting
              ? hasLoop
                ? "∞"
                : `${currentStepId}/${totalSteps}`
              : ""}
          </CircularProgressText>
        </CircularProgress>
      </MinimizedButton>

      {isExpanded && isWorkflowExecuting && (
        <ExpandedTooltip
          top={tooltipPosition.top}
          left={tooltipPosition.left}
          arrowLeft={tooltipPosition.arrowLeft}
          data-tooltip="workflow-expanded"
          onClick={(e) => e.stopPropagation()}
        >
          <WidgetHeader isExpanded={isExpanded}>
            <WidgetTitle>
              <WorkflowIcon>⚡</WorkflowIcon>
              <PrideText text={workflowName || "Workflow"} />
            </WidgetTitle>
            <WidgetProgress>
              <PrideText text={`${currentStepId}/${totalSteps}`} />
              <MiniProgressBar current={currentStepId} total={totalSteps} />
            </WidgetProgress>
          </WidgetHeader>

          <div
            style={{
              fontSize: "0.8rem",
              opacity: "0.8",
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
              color: "inherit",
            }}
          >
            <PrideText text={stepDisplayName} />
            {hasLoop && <LoopIndicator>(Loop Mode 🔄)</LoopIndicator>}
          </div>

          <ExpandedDetails isExpanded={true}>
            <DetailRow>
              <DetailLabel>
                <PrideText text="Current Temp:" />
              </DetailLabel>
              <DetailValue>
                <PrideText
                  text={`${
                    isF
                      ? convertToFahrenheitFromCelsius(currentTemperature)
                      : currentTemperature
                  }${DEGREE_SYMBOL}${isF ? "F" : "C"}`}
                />
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>
                <PrideText text="Target Temp:" />
              </DetailLabel>
              <DetailValue>
                <PrideText
                  text={`${
                    isF
                      ? convertToFahrenheitFromCelsius(targetTemperature)
                      : targetTemperature
                  }${DEGREE_SYMBOL}${isF ? "F" : "C"}`}
                />
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>
                <PrideText text="Expected Time:" />
              </DetailLabel>
              <DetailValue>
                <PrideText text={expectedTime || "N/A"} />
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>
                <PrideText text="Elapsed Time:" />
              </DetailLabel>
              <DetailValue>
                <PrideText
                  text={
                    // Show dramatic decimal precision for fan operations
                    stepType === WorkflowItemTypes.FAN_ON || 
                    stepType === WorkflowItemTypes.FAN_ON_GLOBAL
                      ? `${currentTimeInSeconds.toFixed(1)} ${
                          Math.abs(currentTimeInSeconds - 1) < 0.05 ? "second" : "seconds"
                        }`
                      : `${Math.floor(currentTimeInSeconds)} ${
                          Math.floor(currentTimeInSeconds) === 1 ? "second" : "seconds"
                        }`
                  }
                />
              </DetailValue>
            </DetailRow>

            <WidgetActions>
              <MiniButton
                onClick={(e) => {
                  e.stopPropagation();
                  cancelCurrentWorkflow();
                }}
              >
                <PrideText text="Cancel" />
              </MiniButton>
            </WidgetActions>
          </ExpandedDetails>
          
          <div style={{ 
            position: 'absolute', 
            bottom: '8px', 
            left: '8px' 
          }}>
            <MiniButton
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              <PrideText text="−" />
            </MiniButton>
          </div>
        </ExpandedTooltip>
      )}
    </WorkflowWidget>
  );
}
