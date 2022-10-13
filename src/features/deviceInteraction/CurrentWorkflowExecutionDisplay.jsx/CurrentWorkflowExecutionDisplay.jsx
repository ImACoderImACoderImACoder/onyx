import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCurrentStepEllapsedTimeInSeconds } from "../../workflowEditor/workflowSlice";
import Container from "react-bootstrap/Container";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import WorkflowItemTypes from "../../../constants/enums";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import { convertToFahrenheitFromCelsius } from "../../../services/utils";
import { useRef } from "react";

function TimerEstimate(props) {
  const dispatch = useDispatch();
  const timerStartRef = useRef();

  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds
  );

  useEffect(() => {
    timerStartRef.current = new Date();
    const interval = setInterval(() => {
      console.log("here");
      dispatch(
        setCurrentStepEllapsedTimeInSeconds(
          Math.round((new Date() - timerStartRef.current) / 1000)
        )
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [props.stepId, dispatch]);

  return (
    <PrideTextWithDiv
      text={`Ellapsed Time: ${currentTimeInSeconds} ${
        currentTimeInSeconds === 1 ? "second" : "seconds"
      }`}
    />
  );
}

export default function CurrentWorkflowExecutionDisplay() {
  const executingWorkflow = useSelector((state) => state.workflow);
  const isF = useSelector((state) => state.settings.isF);
  const containerRef = useRef();
  const showCurrentWorkflowDetails = useSelector(
    (state) => state.settings.config.showCurrentWorkflowDetails
  );

  const currentStepId = executingWorkflow?.currentWorkflowStepId;
  const currentWorkflow = executingWorkflow?.currentWorkflow;
  const isWorkflowExecuting = currentStepId && currentWorkflow;

  let workflowName,
    totalSteps,
    stepType,
    showTimer,
    expectedTime,
    stepDisplayName;

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
      default:
        stepDisplayName = "Unknown";
    }
    totalSteps = currentWorkflow.payload.length;
    showTimer = stepType.includes("fan") || stepType.includes("wait");
    expectedTime =
      showTimer &&
      `${currentWorkflow.payload[currentStepId - 1].payload} ${
        currentWorkflow.payload[currentStepId - 1].payload === 1
          ? "Second"
          : "Seconds"
      }`;
  }
  return (
    <Container
      ref={containerRef}
      style={{
        opacity: isWorkflowExecuting ? "1" : "0",
        transition: "opacity 0.35s",
        display: !showCurrentWorkflowDetails && "none",
      }}
    >
      {isWorkflowExecuting && (
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
          <hr></hr>
        </>
      )}
    </Container>
  );
}
