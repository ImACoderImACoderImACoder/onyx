import Select from "react-bootstrap/FormSelect";
import Label from "react-bootstrap/FormLabel";
import Control from "react-bootstrap/FormControl";
import WorkflowItemTypes from "../../constants/enums";
import {
  isValueInValidVolcanoCelciusRange,
  WriteNewConfigToLocalStorage,
} from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import styled from "styled-components";
import DeleteWorkflowItem from "./DeleteWorkflowItem";
import { setCurrentWorkflows } from "../settings/settingsSlice";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import WorkflowItemDiv from "./shared/WorkflowItemDiv";
import StyledControl from "../shared/styledComponents/FormControl";
import {
  convertToCelsiusFromFahrenheit,
  convertToFahrenheitFromCelsius,
} from "../../services/utils";
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
  DEGREE_SYMBOL,
} from "../../constants/temperature";

const StyledSelect = styled(Select)`
  color: ${(props) => props.theme.settingsPageColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
`;

const StyledActionTypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StyledPayloadDiv = styled.div`
  margin-top: 8px;
`;
export default function WorkflowItemEditor(props) {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const isF = useSelector((state) => state.settings.isF);
  let initialPayloadInputState;
  if (props.item.type !== WorkflowItemTypes.HEAT_ON) {
    initialPayloadInputState = props.item.payload;
  } else {
    if (props.item.payload === null) {
      initialPayloadInputState = "";
    } else {
      initialPayloadInputState = isF
        ? convertToFahrenheitFromCelsius(props.item.payload)
        : props.item.payload;
    }
  }
  const [payloadInput, setPayloadInput] = useState(initialPayloadInputState);

  const getPayloadLabelByType = (type) => {
    switch (type) {
      case WorkflowItemTypes.WAIT:
      case WorkflowItemTypes.FAN_ON: {
        return "Seconds";
      }
      case WorkflowItemTypes.HEAT_ON: {
        return `${DEGREE_SYMBOL}${isF ? "F" : "C"} `;
      }
      case WorkflowItemTypes.HEAT_OFF: {
        return undefined;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return "Brightnes (0-100)";
      }
      default: {
        return undefined;
      }
    }
  };

  const getDefaultPayloadValueByType = (type) => {
    switch (type) {
      case WorkflowItemTypes.FAN_ON: {
        return 35.5;
      }
      case WorkflowItemTypes.HEAT_ON: {
        return isF ? 104 : 40;
      }
      case WorkflowItemTypes.HEAT_OFF: {
        return undefined;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return 70;
      }
      case WorkflowItemTypes.WAIT: {
        return 1;
      }
      default: {
        return undefined;
      }
    }
  };

  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const onChange = (e) => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.find((r) => r.id === props.workflowId);
    const itemIndex = workflow.payload.findIndex((r) => r.id === props.item.id);

    const item = workflow.payload[itemIndex];
    item.type = e.target.value;

    if (
      !item.payload ||
      item.type === WorkflowItemTypes.HEAT_OFF ||
      !isPayloadValid({ payload: item.payload, type: item.type })
    ) {
      const defaultValue = getDefaultPayloadValueByType(e.target.value);
      item.payload = defaultValue;
      setPayloadInput(defaultValue || "");
      setIsValid(true);
    }

    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
  };

  const isPayloadValid = ({ payload, type }) => {
    const parsedPayloadInput = parseFloat(payload);
    switch (type) {
      case WorkflowItemTypes.WAIT:
      case WorkflowItemTypes.FAN_ON: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) && parsedPayloadInput > 0;
        if (!isPayloadValid) {
          setErrorMessage("Value must be a number and greater than 0");
        }
        return isPayloadValid;
      }
      case WorkflowItemTypes.HEAT_ON: {
        const normalizedHeatOnValue = isF
          ? convertToCelsiusFromFahrenheit(parsedPayloadInput)
          : parsedPayloadInput;

        const isPayloadValid =
          (isValueInValidVolcanoCelciusRange(normalizedHeatOnValue) &&
            !isNaN(parsedPayloadInput)) ||
          payload === "";

        const minTemperature = isF
          ? convertToFahrenheitFromCelsius(MIN_CELSIUS_TEMP)
          : MIN_CELSIUS_TEMP;
        const MaxTemperature = isF
          ? convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)
          : MAX_CELSIUS_TEMP;

        if (!isPayloadValid) {
          setErrorMessage(
            `Temperature must be between ${minTemperature} and ${MaxTemperature}`
          );
        }

        return isPayloadValid;
      }
      case WorkflowItemTypes.HEAT_OFF: {
        return true;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) &&
          parsedPayloadInput >= 0 &&
          parsedPayloadInput <= 100;

        if (!isPayloadValid) {
          setErrorMessage("Value must be 0-100");
        }
        return isPayloadValid;
      }
      default: {
        return false;
      }
    }
  };

  const onPayloadBlur = (e) => {
    if (!isPayloadValid({ type: props.item.type, payload: payloadInput })) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.find((r) => r.id === props.workflowId);
    const itemIndex = workflow.payload.findIndex((r) => r.id === props.item.id);

    const item = workflow.payload[itemIndex];
    item.payload = parseFloat(e.target.value);

    if (item.type === WorkflowItemTypes.HEAT_ON && isF) {
      item.payload = convertToCelsiusFromFahrenheit(item.payload);
    }
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
  };

  const name = `Action ${props.itemIndex + 1}`;

  return (
    <WorkflowItemDiv>
      <div>
        <StyledActionTypeHeader>
          <StyledLabel>{name}</StyledLabel>
          <DeleteWorkflowItem
            workflowId={props.workflowId}
            workflowItemId={props.item.id}
            name={name}
          />
        </StyledActionTypeHeader>
        <StyledSelect defaultValue={props.item.type} onChange={onChange}>
          <option value={WorkflowItemTypes.HEAT_ON}>Heat On</option>
          <option value={WorkflowItemTypes.FAN_ON}>Fan On</option>
          <option value={WorkflowItemTypes.WAIT}>Pause/Wait</option>
          <option value={WorkflowItemTypes.HEAT_OFF}>Heat Off</option>
          <option value={WorkflowItemTypes.SET_LED_BRIGHTNESS}>
            Set LED Brightness
          </option>
        </StyledSelect>
      </div>

      {props.item.type !== WorkflowItemTypes.HEAT_OFF && (
        <StyledPayloadDiv>
          <StyledLabel>{getPayloadLabelByType(props.item.type)}</StyledLabel>
          <StyledControl
            type="number"
            inputMode="decimal"
            value={payloadInput}
            onChange={(e) => setPayloadInput(e.target.value)}
            onBlur={onPayloadBlur}
            isValid={isValid}
            isInvalid={!isValid}
            disabled={props.item.type === WorkflowItemTypes.HEAT_OFF}
          />
          <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
        </StyledPayloadDiv>
      )}
    </WorkflowItemDiv>
  );
}
