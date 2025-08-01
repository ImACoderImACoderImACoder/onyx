import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setCurrentStepEllapsedTimeInSeconds,
  setCurrentStepStartTimestamp,
} from "../../workflowEditor/workflowSlice";
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
import styled, { keyframes, useTheme } from "styled-components";
import { createPortal } from "react-dom";

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
  min-height: 70px;
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
  background: ${(props) => props.theme.backgroundColor || "rgba(0, 0, 0, 0.9)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  width: ${(props) => props.width || "auto"};
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
    props.theme.primaryColor || props.theme.primaryFontColor};
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
      props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
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
  width: 50px;
  position: relative;
  margin-top: 10px;

  .circular-chart {
    display: block;
    width: 100%;
    height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: ${(props) => props.theme.iconColor};
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke: ${(props) => props.theme.backgroundColor};
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-dasharray: 100, 100;
    stroke-dashoffset: ${(props) => props.progress * -1 || 0};
    transition: stroke-dashoffset 0.75s ease;
  }

  .percentage {
    font-size: 0.675em;
    text-anchor: middle;
    dominant-baseline: middle;
    fill: ${(props) => props.theme.iconColor};
  }
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
    transform: "translateX(-50%)",
  });
  const containerRef = useRef();
  const buttonRef = useRef();
  const timerStartRef = useRef();
  const dispatch = useDispatch();
  const theme = useTheme();

  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

  const currentStepStartTimestamp = useSelector(
    (state) => state.workflow.currentStepStartTimestamp
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

  // Timer logic using stored timestamp for persistence
  useEffect(() => {
    if (!isWorkflowExecuting || !currentStepStartTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.round(
        (now - currentStepStartTimestamp) / 1000
      );
      dispatch(setCurrentStepEllapsedTimeInSeconds(elapsedSeconds));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    currentStepId,
    wasWaiting,
    dispatch,
    isWorkflowExecuting,
    currentStepStartTimestamp,
  ]);

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
        const now = Date.now();
        dispatch(setCurrentStepStartTimestamp(now));
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
      // Check if this component is visible (not the hidden one in MinimalistLayout)
      const isHidden =
        containerRef.current?.closest('[style*="display: none"]') ||
        containerRef.current?.closest('[style*="display:none"]');

      if (isHidden) {
        return;
      }

      setIsExpanded(true);

      // Simple positioning - just center below the button
      setTimeout(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();

          console.log("DEBUG: Button rect:", {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            element: buttonRef.current,
            elementHTML: buttonRef.current.outerHTML.substring(0, 200),
          });

          setTooltipPosition({
            top: `${rect.bottom + 8}px`,
            left: `${rect.left + rect.width / 2 + 5}px`,
            arrowLeft: "50%",
            transform: "translateX(-50%)",
          });

          console.log("DEBUG: Set tooltip position to:", {
            top: `${rect.bottom + 8}px`,
            left: `${rect.left + rect.width / 2}px`,
          });
        } else {
          console.log("DEBUG: buttonRef.current is null");
        }
      }, 100);
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

  // Update tooltip position on window resize
  useEffect(() => {
    if (!isExpanded || !isWorkflowExecuting) return;

    const handleResize = () => {
      // Check if this component is visible (not the hidden one in MinimalistLayout)
      const isHidden =
        containerRef.current?.closest('[style*="display: none"]') ||
        containerRef.current?.closest('[style*="display:none"]');

      if (isHidden) return;

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();

        setTooltipPosition({
          top: `${rect.bottom + 8}px`,
          left: `${rect.left + rect.width / 2 + 5}px`,
          arrowLeft: "50%",
          transform: "translateX(-50%)",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, isWorkflowExecuting]);

  const handleWidgetClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent expansion when clicking on buttons
    if (e.target.closest("button")) return;

    // Check if this is the hidden component
    const isHidden =
      containerRef.current?.closest('[style*="display: none"]') ||
      containerRef.current?.closest('[style*="display:none"]');

    if (isHidden) {
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setTooltipPosition({
        top: `${rect.bottom + 8}px`,
        left: `${rect.left + rect.width / 2 + 5}px`,
        arrowLeft: "50%",
        transform: "translateX(-50%)",
      });
    }

    setIsExpanded(!isExpanded);
  };

  // Check if this component is in a hidden container
  const isHidden =
    containerRef.current?.closest('[style*="display: none"]') ||
    containerRef.current?.closest('[style*="display:none"]');

  // Portal tooltip - only render for visible component
  const tooltipPortal =
    isExpanded && isWorkflowExecuting && !isHidden
      ? createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transform: tooltipPosition.transform,
              zIndex: 10000,
              background: theme.backgroundColor || "rgba(0, 0, 0, 0.9)",
              border: `1px solid ${
                theme.borderColor || "rgba(255, 255, 255, 0.1)"
              }`,
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              minWidth: "280px",
              maxWidth: "400px",
              pointerEvents: "auto",
              color: theme.primaryFontColor || "white",
            }}
            data-tooltip="workflow-expanded"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tooltip arrow */}
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: `6px solid ${
                  theme.borderColor || "rgba(255, 255, 255, 0.1)"
                }`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: `5px solid ${
                  theme.backgroundColor || "rgba(0, 0, 0, 0.9)"
                }`,
                marginTop: "1px",
              }}
            />
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
                    text={(() => {
                      const mins = Math.floor(currentTimeInSeconds / 60);
                      const secs = Math.floor(currentTimeInSeconds % 60);
                      const deciseconds = Math.floor(
                        (currentTimeInSeconds % 1) * 10
                      );
                      return `${mins.toString().padStart(2, "0")}:${secs
                        .toString()
                        .padStart(2, "0")}`;
                    })()}
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

            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
              }}
            >
              <MiniButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                <PrideText text="−" />
              </MiniButton>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <WorkflowWidget ref={containerRef} isVisible={isWorkflowExecuting}>
        <MinimizedButton
          ref={buttonRef}
          onClick={handleWidgetClick}
          data-widget-button="true"
        >
          <CircularProgress progress={(currentStepId / totalSteps) * 100}>
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="19" className="percentage">
                {isWorkflowExecuting ? (hasLoop ? "∞" : currentStepId) : ""}
              </text>
            </svg>
          </CircularProgress>
        </MinimizedButton>
      </WorkflowWidget>

      {tooltipPortal}
    </>
  );
}
