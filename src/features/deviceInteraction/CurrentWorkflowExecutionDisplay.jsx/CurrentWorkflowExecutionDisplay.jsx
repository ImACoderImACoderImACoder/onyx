import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentStepEllapsedTimeInSeconds } from "../../workflowEditor/workflowSlice";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import WorkflowItemTypes from "../../../constants/enums";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import { convertToFahrenheitFromCelsius, convertToCelsiusFromFahrenheit } from "../../../services/utils";
import { useRef } from "react";
import { ActiveButton } from "../WriteTemperature/styledComponents";
import { cancelCurrentWorkflow } from "../../../services/bleQueueing";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Algorithm to estimate heating time based on temperature delta
// Adjusted to match real-world Volcano performance
function estimateHeatingTime(currentTemp, targetTemp) {
  const tempDelta = Math.abs(targetTemp - currentTemp);
  
  // If target is lower than current, no heating time needed
  if (targetTemp <= currentTemp) {
    return 0;
  }
  
  // Real-world heating rates are slower than theoretical
  // Adjusted to be ~3x longer based on user feedback
  let heatingRate;
  
  if (targetTemp <= 200) {
    // Normal range: ~0.6°C/second (was 1.8)
    heatingRate = 0.6;
  } else if (targetTemp <= 220) {
    // Higher temps: ~0.5°C/second (was 1.5)
    heatingRate = 0.5;
  } else {
    // Maximum temps: ~0.4°C/second (was 1.2)
    heatingRate = 0.4;
  }
  
  // Calculate base time
  let totalTime = tempDelta / heatingRate;
  
  // Add overhead for device stabilization and BLE delays (10-15 seconds)
  const baseOverhead = Math.min(15, tempDelta * 0.1);
  totalTime += baseOverhead;
  
  return Math.round(totalTime);
}

function TimerEstimate(props) {
  const dispatch = useDispatch();
  const timerStartRef = useRef();

  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

  useEffect(() => {
    // Reset the timer start reference when currentTimeInSeconds is 0
    // This handles the case when we manually reset the timer
    if (currentTimeInSeconds === 0) {
      timerStartRef.current = new Date();
    }
  }, [currentTimeInSeconds]);

  useEffect(() => {
    timerStartRef.current = new Date();
    const interval = setInterval(() => {
      dispatch(
        setCurrentStepEllapsedTimeInSeconds(
          Math.round((new Date() - timerStartRef.current) / 1000)
        )
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      timerStartRef.current = undefined;
    };
  }, [props.stepId, props.resetKey, dispatch]);

  return (
    <PrideTextWithDiv
      text={`Elapsed Time: ${currentTimeInSeconds} ${
        currentTimeInSeconds === 1 ? "second" : "seconds"
      }`}
    />
  );
}

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

const WorkflowContainer = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  margin: 12px auto;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.isVisible ? '1' : '0'};
  max-height: ${props => props.isVisible ? 'auto' : '0'};
  overflow: ${props => props.isVisible ? 'visible' : 'hidden'};
  width: calc(100% - 40px);
  max-width: 800px;
  min-width: 320px;
  
  @media (max-width: 768px) {
    margin: 8px auto;
    padding: 12px 16px;
    width: calc(100% - 24px);
  }
`;

const WorkflowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const WorkflowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
`;

const WorkflowIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProgressBar = styled.div`
  background: ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  height: 6px;
  width: 60px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => (props.current / props.total) * 100}%;
    background: ${props => props.theme.primaryColor || props.theme.primaryFontColor};
    border-radius: 10px;
    transition: width 0.3s ease;
  }
`;

const WorkflowDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const DetailItem = styled.div`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
`;

const DetailLabel = styled.div`
  opacity: 0.7;
  font-size: 0.75rem;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-weight: 500;
`;

const CancelButton = styled(ActiveButton)`
  width: auto;
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 6px;
  margin: 0;
`;

const LoopIndicator = styled.span`
  color: ${props => props.theme.iconColor};
  font-size: 0.85em;
  opacity: 0.9;
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
  const [isRemovedFromDom, setIsRemovedFromDom] = useState(false);
  const [heatingStartTemp, setHeatingStartTemp] = useState(null);
  const [heatingTargetTemp, setHeatingTargetTemp] = useState(null);
  const [calculatedHeatingTime, setCalculatedHeatingTime] = useState(null);
  const [wasWaiting, setWasWaiting] = useState(false);
  const containerRef = useRef();
  const dispatch = useDispatch();
  const showCurrentWorkflowDetails = useSelector(
    (state) => state.settings.config.showCurrentWorkflowDetails
  );

  const fanOnGlobalValue = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal
  );

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
      item => item.type === WorkflowItemTypes.LOOP_FROM_BEGINNING
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
          const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
          const targetTempC = heatStep.nextTemp;
          
          if (currentTempC >= targetTempC && heatStep.wait > 0) {
            stepDisplayName = `Waiting at ${nextHeat}°${isF ? 'F' : 'C'}`;
          } else {
            stepDisplayName = `Heating from ${previousHeat} to ${nextHeat}`;
          }
        } else {
          const defaultTemp = isF
            ? convertToFahrenheitFromCelsius(payload.default.temp)
            : payload.default.temp;
          
          // Check if we've reached default temp and are waiting
          const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
          const targetTempC = payload.default.temp;
          
          if (currentTempC >= targetTempC && payload.default.wait > 0) {
            stepDisplayName = `Waiting at ${defaultTemp}°${isF ? 'F' : 'C'}`;
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
    showTimer = stepType.includes("fan") || stepType.includes("wait") || stepType.includes("heat");
    
    // For conditional heat, check if we're in waiting mode to show timer
    if (stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
      const payload = currentWorkflow.payload[currentStepId - 1].payload;
      const heatStep = payload.conditions.find((x) => x.nextTemp === targetTemperature);
      
      if (heatStep) {
        const currentTempC = isF ? (currentTemperature - 32) * 5/9 : currentTemperature;
        const targetTempC = isF ? (heatStep.nextTemp - 32) * 5/9 : heatStep.nextTemp;
        showTimer = showTimer || (currentTempC >= targetTempC && heatStep.wait > 0);
      } else {
        const currentTempC = isF ? (currentTemperature - 32) * 5/9 : currentTemperature;
        const targetTempC = isF ? (payload.default.temp - 32) * 5/9 : payload.default.temp;
        showTimer = showTimer || (currentTempC >= targetTempC && payload.default.wait > 0);
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
      let heatTargetTemp = 0;
      let isWaiting = false;
      
      if (stepType === WorkflowItemTypes.HEAT_ON) {
        heatTargetTemp = currentWorkflow.payload[currentStepId - 1].payload;
      } else if (stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
        const payload = currentWorkflow.payload[currentStepId - 1].payload;
        const heatStep = payload.conditions.find(
          (x) => x.nextTemp === targetTemperature
        );
        
        if (heatStep) {
          heatTargetTemp = heatStep.nextTemp;
          // Check if we're in waiting phase
          const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
          const targetTempC = heatStep.nextTemp;
          
          if (currentTempC >= targetTempC && heatStep.wait > 0) {
            // We're waiting - show wait time
            expectedTime = `${heatStep.wait} ${heatStep.wait === 1 ? "Second" : "Seconds"}`;
            isWaiting = true;
          }
        } else {
          heatTargetTemp = payload.default.temp;
          // Check if we're in waiting phase for default
          const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
          const targetTempC = payload.default.temp;
          
          if (currentTempC >= targetTempC && payload.default.wait > 0) {
            // We're waiting - show wait time
            expectedTime = `${payload.default.wait} ${payload.default.wait === 1 ? "Second" : "Seconds"}`;
            isWaiting = true;
          }
        }
      }
      
      if (!isWaiting) {
        // Use pre-calculated heating time instead of recalculating
        if (calculatedHeatingTime !== null) {
          expectedTime = calculatedHeatingTime > 0 ? `~${calculatedHeatingTime} Seconds` : "Already at target";
        } else {
          expectedTime = "~60 Seconds";
        }
      }
    } else {
      expectedTime = showTimer ? "N/A" : "";
    }
  }

  // Track when we start a new heating step to calculate time once
  useEffect(() => {
    if (isWorkflowExecuting && stepType && stepType.includes("heat")) {
      // Check if this is a new heating step (different step ID or different target)
      const payload = currentWorkflow.payload[currentStepId - 1].payload;
      let newTargetTemp = 0;
      
      if (stepType === WorkflowItemTypes.HEAT_ON) {
        newTargetTemp = payload;
      } else if (stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
        const heatStep = payload.conditions?.find(
          (x) => x.nextTemp === targetTemperature
        );
        newTargetTemp = heatStep ? heatStep.nextTemp : payload.default?.temp || 0;
      }
      
      // If target temperature changed or we just started heating, calculate time
      if (newTargetTemp > 0 && (newTargetTemp !== heatingTargetTemp || heatingStartTemp === null)) {
        const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
        const targetTempC = newTargetTemp;
        
        setHeatingStartTemp(currentTempC);
        setHeatingTargetTemp(targetTempC);
        
        const estimatedTime = estimateHeatingTime(currentTempC, targetTempC);
        setCalculatedHeatingTime(estimatedTime);
      }
    } else {
      // Reset when not heating
      setHeatingStartTemp(null);
      setHeatingTargetTemp(null);
      setCalculatedHeatingTime(null);
    }
  }, [currentStepId, stepType, isWorkflowExecuting, currentWorkflow, targetTemperature, currentTemperature, isF, heatingTargetTemp, heatingStartTemp]);

  // Detect transition from heating to waiting and reset elapsed time
  useEffect(() => {
    if (isWorkflowExecuting && stepType === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS) {
      const payload = currentWorkflow.payload[currentStepId - 1].payload;
      const heatStep = payload.conditions?.find((x) => x.nextTemp === targetTemperature);
      
      let isCurrentlyWaiting = false;
      if (heatStep) {
        const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
        const targetTempC = heatStep.nextTemp;
        isCurrentlyWaiting = currentTempC >= targetTempC && heatStep.wait > 0;
      } else if (payload.default) {
        const currentTempC = isF ? convertToCelsiusFromFahrenheit(currentTemperature) : currentTemperature;
        const targetTempC = payload.default.temp;
        isCurrentlyWaiting = currentTempC >= targetTempC && payload.default.wait > 0;
      }
      
      // If we just transitioned from heating to waiting, reset the timer
      if (isCurrentlyWaiting && !wasWaiting) {
        dispatch(setCurrentStepEllapsedTimeInSeconds(0));
      }
      
      setWasWaiting(isCurrentlyWaiting);
    }
  }, [currentTemperature, targetTemperature, isF, stepType, currentWorkflow, currentStepId, isWorkflowExecuting, wasWaiting, dispatch]);

  let prevTimeoutId = useRef();
  useEffect(() => {
    if (!isWorkflowExecuting) {
      prevTimeoutId.current = setTimeout(() => {
        setIsRemovedFromDom(true);
      }, 350);
    } else {
      setIsRemovedFromDom(false);
      if (prevTimeoutId.current) {
        clearTimeout(prevTimeoutId.current);
        prevTimeoutId.current = undefined;
      }
    }
  }, [isWorkflowExecuting]);

  const location = useLocation();
  
  if (!showCurrentWorkflowDetails) {
    return null;
  }

  return (
    <WorkflowContainer 
      ref={containerRef}
      isVisible={isWorkflowExecuting && !isRemovedFromDom}
    >
      {!isRemovedFromDom && (
        <>
          <WorkflowHeader>
            <WorkflowTitle>
              <WorkflowIcon>⚡</WorkflowIcon>
              <PrideText text={workflowName || "Current Workflow"} />
            </WorkflowTitle>
            <HeaderRight>
              <ProgressContainer>
                <span>{currentStepId}/{totalSteps}</span>
                <ProgressBar current={currentStepId} total={totalSteps} />
                {hasLoop && <LoopIndicator>(🔄 looping)</LoopIndicator>}
              </ProgressContainer>
              <CancelButton
                onClick={() => {
                  cancelCurrentWorkflow();
                }}
              >
                <PrideText text="Cancel" />
              </CancelButton>
            </HeaderRight>
          </WorkflowHeader>

          <WorkflowDetails>
            <DetailItem>
              <DetailLabel>Current Step</DetailLabel>
              <DetailValue>
                <PrideText text={stepDisplayName} />
              </DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Expected Time</DetailLabel>
              <DetailValue>
                <PrideText text={expectedTime || "N/A"} />
              </DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Elapsed Time</DetailLabel>
              <DetailValue>
                <TimerEstimate stepId={currentStepId} resetKey={wasWaiting ? 'waiting' : 'heating'} />
              </DetailValue>
            </DetailItem>
          </WorkflowDetails>
        </>
      )}
    </WorkflowContainer>
  );
}
