import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentStepEllapsedTimeInSeconds } from "../../workflowEditor/workflowSlice";
import Container from "react-bootstrap/Container";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import WorkflowItemTypes from "../../../constants/enums";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import { convertToFahrenheitFromCelsius } from "../../../services/utils";
import { useRef } from "react";
import { ActiveButton } from "../WriteTemperature/styledComponents";
import { cancelCurrentWorkflow } from "../../../services/bleQueueing";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function TimerEstimate(props) {
  const dispatch = useDispatch();
  const timerStartRef = useRef();

  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

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
  }, [props.stepId, dispatch]);

  return (
    <PrideTextWithDiv
      text={`Elapsed Time: ${currentTimeInSeconds} ${
        currentTimeInSeconds === 1 ? "second" : "seconds"
      }`}
    />
  );
}

export default function CurrentWorkflowExecutionDisplay() {
  const executingWorkflow = useSelector((state) => state.workflow);
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );
  const isF = useSelector((state) => state.settings.isF);
  const [isRemovedFromDom, setIsRemovedFromDom] = useState(false);
  const containerRef = useRef();
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
    stepDisplayName = "N/A";

  if (isWorkflowExecuting) {
    workflowName = currentWorkflow.name;
    stepType = currentWorkflow.payload[currentStepId - 1].type;
    const payload = currentWorkflow.payload[currentStepId - 1].payload;
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
          stepDisplayName = `Heating from ${previousHeat} to ${nextHeat}`;
        } else {
          stepDisplayName = `Heating to ${
            isF
              ? convertToFahrenheitFromCelsius(payload.default.temp)
              : payload.default.temp
          }`;
        }

        break;
      default:
        stepDisplayName = "Unknown";
    }
    totalSteps = currentWorkflow.payload.length;
    showTimer = stepType.includes("fan") || stepType.includes("wait");

    expectedTime =
      showTimer &&
      `${
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
  }

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
  return (
    <Container
      ref={containerRef}
      style={{
        opacity: isWorkflowExecuting ? "1" : "0",
        transition: `opacity 0.${isWorkflowExecuting ? "70" : "35"}s`,
        display: !showCurrentWorkflowDetails && "none",
      }}
    >
      {!isRemovedFromDom && (
        <>
          <h2>
            <PrideText text="Current Workflow" />
          </h2>
          <PrideTextWithDiv text={`Workflow: ${workflowName}`} />
          <PrideTextWithDiv
            text={`${stepDisplayName} (${currentStepId}/${totalSteps})`}
          />
          <PrideTextWithDiv text={`Expected Time: ${expectedTime || "N/A"}`} />
          <TimerEstimate stepId={currentStepId} />
          {location.pathname !== "/Volcano/App" && (
            <ActiveButton
              style={{ width: "175px" }}
              onClick={() => {
                cancelCurrentWorkflow();
              }}
            >
              <PrideText text="Tap to Cancel" />
            </ActiveButton>
          )}
          <hr></hr>
        </>
      )}
    </Container>
  );
}
