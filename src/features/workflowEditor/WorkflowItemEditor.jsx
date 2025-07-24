import Select from "react-bootstrap/FormSelect";
import Label from "react-bootstrap/FormLabel";
import Control from "react-bootstrap/FormControl";
import WorkflowItemTypes from "../../constants/enums";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import styled from "styled-components";
import DeleteWorkflowItem from "./DeleteWorkflowItem";
import MoveWorkflowItemDownOneIndex from "./SwapWorkflowItemTowardsBeginning";
import MoveWorkflowItemUpOneIndex from "./SwapWorkflowItemTowardsEnd";
import { setCurrentWorkflows, setFanOnGlobal } from "../settings/settingsSlice";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import WorkflowItemDiv from "./shared/WorkflowItemDiv";
import StyledControl from "../shared/styledComponents/FormControl";
import {
  convertToCelsiusFromFahrenheit,
  convertToFahrenheitFromCelsius,
} from "../../services/utils";
import { DEGREE_SYMBOL, MIN_CELSIUS_TEMP } from "../../constants/temperature";
import isPayloadValid from "./shared/WorkflowItemValidator";
import PrideText from "../../themes/PrideText";
import { useEffect } from "react";
import Drag from "./DND/WorkflowItemDrag";
import WorkflowItemDrop from "./DND/WorkflowItemDrop";
import ConditionalHeatItemEditor from "./ConditionalHeatItemEditor";
const StyledSelect = styled(Select)`
  color: ${(props) => props.theme.primaryFontColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.primaryColor};
    background-color: ${(props) => props.theme.buttonColorMain};
  }
  
  &:focus {
    border-color: ${(props) => props.theme.buttonActive.borderColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.buttonActive.borderColor}33;
    outline: none;
  }
`;

export const StyledLabel = styled(Label)`
  align-items: center;
  margin-right: auto;
  font-weight: 600;
  font-size: 1rem;
  color: ${(props) => props.theme.primaryFontColor};
  margin-bottom: 8px;
  display: block;
`;

const StyledActionTypeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const StyledPayloadDiv = styled.div`
  margin-top: 20px;
  background: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  padding: 16px;
`;

const ActionTypeContainer = styled.div`
  margin-bottom: 16px;
`;

const ActionControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

export default function WorkflowItemEditor(props) {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const fanOnGlobal = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal
  );
  const isF = useSelector((state) => state.settings.isF);

  useEffect(() => {
    if (
      (props.item.type === WorkflowItemTypes.HEAT_ON ||
        props.item.type ===
          WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS) &&
      props.item.payload
    ) {
      const nextPayloadInput = isF
        ? convertToFahrenheitFromCelsius(props.item.payload)
        : props.item.payload;
      setPayloadInput(nextPayloadInput);
    }
  }, [isF, props.item]);

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

  if (props.item.type === WorkflowItemTypes.FAN_ON_GLOBAL) {
    initialPayloadInputState = fanOnGlobal;
  }

  const [payloadInput, setPayloadInput] = useState(initialPayloadInputState);

  useEffect(() => {
    if (props.item.type === WorkflowItemTypes.FAN_ON_GLOBAL) {
      setPayloadInput(fanOnGlobal);
    }
  }, [fanOnGlobal, props.item.type]);

  const getPayloadLabelByType = (type) => {
    switch (type) {
      case WorkflowItemTypes.WAIT:
      case WorkflowItemTypes.FAN_ON_GLOBAL:
      case WorkflowItemTypes.FAN_ON: {
        return "Seconds";
      }
      case WorkflowItemTypes.HEAT_ON: {
        return `${DEGREE_SYMBOL}${isF ? "F" : "C"} `;
      }
      case WorkflowItemTypes.LOOP_FROM_BEGINNING:
      case WorkflowItemTypes.HEAT_OFF: {
        return undefined;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return "Brightness (0-100)";
      }
      case WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS: {
        return "Exit workflow until when target temperature is";
      }
      default: {
        return undefined;
      }
    }
  };

  const getDefaultPayloadValueByType = (type) => {
    switch (type) {
      case WorkflowItemTypes.FAN_ON_GLOBAL: {
        return fanOnGlobal;
      }
      case WorkflowItemTypes.FAN_ON: {
        return 35.5;
      }
      case WorkflowItemTypes.HEAT_ON: {
        return "";
      }
      case WorkflowItemTypes.HEAT_OFF: {
        return undefined;
      }
      case WorkflowItemTypes.LOOP_FROM_BEGINNING: {
        return undefined;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return 70;
      }
      case WorkflowItemTypes.WAIT: {
        return 1;
      }
      case WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS: {
        return MIN_CELSIUS_TEMP;
      }
      case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS: {
        return {
          default: {
            temp: 180,
            wait: undefined,
          },
          conditions: [
            {
              id: Date.now(),
              ifTemp: 180,
              nextTemp: 185,
              wait: undefined,
            },
          ],
        };
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
    const workflow = newConfig.workflows.items.find(
      (r) => r.id === props.workflowId
    );
    const itemIndex = workflow.payload.findIndex((r) => r.id === props.item.id);

    const item = workflow.payload[itemIndex];
    item.type = e.target.value;

    if (
      !item.payload ||
      item.type === WorkflowItemTypes.FAN_ON_GLOBAL ||
      item.type === WorkflowItemTypes.HEAT_OFF ||
      !isPayloadValid(
        { payload: item.payload, type: item.type },
        isF,
        setErrorMessage
      )
    ) {
      const defaultValue = getDefaultPayloadValueByType(e.target.value);
      item.payload = defaultValue;
      setPayloadInput(defaultValue || "");
      if (item.type === WorkflowItemTypes.FAN_ON_GLOBAL) {
        newConfig.workflows[WorkflowItemTypes.FAN_ON_GLOBAL] = defaultValue;
      }
      setIsValid(true);
    }

    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };

  const onPayloadBlur = (e) => {
    if (
      !isPayloadValid(
        { type: props.item.type, payload: payloadInput },
        isF,
        setErrorMessage
      )
    ) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.items.find(
      (r) => r.id === props.workflowId
    );
    const itemIndex = workflow.payload.findIndex((r) => r.id === props.item.id);

    const item = workflow.payload[itemIndex];
    item.payload = parseFloat(e.target.value);

    if (
      (item.type === WorkflowItemTypes.HEAT_ON ||
        item.type ===
          WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS) &&
      isF
    ) {
      item.payload = convertToCelsiusFromFahrenheit(item.payload);
    }

    if (item.type === WorkflowItemTypes.FAN_ON_GLOBAL) {
      newConfig.workflows[WorkflowItemTypes.FAN_ON_GLOBAL] = item.payload;
      dispatch(setFanOnGlobal(item.payload));
    }
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };

  const name = `Action ${props.itemIndex + 1}`;

  return (
    <>
      {props.addDropZoneToTop && (
        <WorkflowItemDrop
          ey={`${props.workflowId} ${props.item.id}`}
          itemId={props.item.id}
          itemIndex={0}
        />
      )}
      <WorkflowItemDiv>
        <StyledActionTypeHeader>
          <Drag
            onDrag={() => {}}
            key={props.item.id}
            itemId={props.item.id}
            workflowId={props.workflowId}
            itemIndex={props.itemIndex}
            itemName={name}
          >
            <StyledLabel>
              <PrideText text={name} />
            </StyledLabel>
          </Drag>

          <ActionControlsContainer>
            <MoveWorkflowItemDownOneIndex
              workflowId={props.workflowId}
              workflowItemId={props.item.id}
              name={name}
            />
            <MoveWorkflowItemUpOneIndex
              workflowId={props.workflowId}
              workflowItemId={props.item.id}
              name={name}
            />
            <DeleteWorkflowItem
              workflowId={props.workflowId}
              workflowItemId={props.item.id}
              name={name}
            />
          </ActionControlsContainer>
        </StyledActionTypeHeader>
        
        <ActionTypeContainer>
          <StyledLabel>Action Type</StyledLabel>
          <StyledSelect defaultValue={props.item.type} onChange={onChange}>
            <option value={WorkflowItemTypes.HEAT_ON}>🔥 Heat On</option>
            <option value={WorkflowItemTypes.FAN_ON}>🌪️ Fan On</option>
            <option value={WorkflowItemTypes.FAN_ON_GLOBAL}>
              🌍 Fan On Global
            </option>
            <option value={WorkflowItemTypes.WAIT}>⏸️ Pause/Wait</option>
            <option value={WorkflowItemTypes.HEAT_OFF}>❄️ Heat Off</option>
            <option value={WorkflowItemTypes.SET_LED_BRIGHTNESS}>
              💡 Set LED Brightness
            </option>
            <option
              value={WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS}
            >
              🚪 Exit When Target Temperature
            </option>
            <option value={WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS}>
              🎯 Conditional Temperature Set
            </option>
            <option value={WorkflowItemTypes.LOOP_FROM_BEGINNING}>
              🔄 Start Workflow From Beginning
            </option>
          </StyledSelect>
        </ActionTypeContainer>

        {![
          WorkflowItemTypes.HEAT_OFF,
          WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS,
          WorkflowItemTypes.LOOP_FROM_BEGINNING,
        ].includes(props.item.type) && (
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
        {props.item.type === WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS && (
          <ConditionalHeatItemEditor
            workflowId={props.workflowId}
            item={props.item}
          />
        )}
      </WorkflowItemDiv>
      <WorkflowItemDrop
        key={`${props.workflowId} ${props.item.id} ${props.item.itemIndex}`}
        itemId={props.item.id}
        itemIndex={props.itemIndex + 1}
      />
    </>
  );
}
