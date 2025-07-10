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
  border-color: ${(props) => props.theme.borderColor};
`;

export const StyledLabel = styled(Label)`
  align-items: center;
  margin-right: auto;
`;

const StyledActionTypeHeader = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 8px;
`;

const StyledPayloadDiv = styled.div`
  margin-top: 8px;
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
        props.item.type === WorkflowItemTypes.LOOP_UNTIL_TARGET_TEMPERATURE) &&
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
      case WorkflowItemTypes.HEAT_OFF: {
        return undefined;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return "Brightness (0-100)";
      }
      case WorkflowItemTypes.LOOP_UNTIL_TARGET_TEMPERATURE: {
        return "Loop workflow until target temperature is";
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
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        return 70;
      }
      case WorkflowItemTypes.WAIT: {
        return 1;
      }
      case WorkflowItemTypes.LOOP_UNTIL_TARGET_TEMPERATURE: {
        return MIN_CELSIUS_TEMP;
      }
      case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS: {
        return {
          default: {
            temp: MIN_CELSIUS_TEMP,
            wait: 5,
          },
          conditions: [
            {
              ifTemp: MIN_CELSIUS_TEMP,
              nextTemp: 180,
              wait: 5,
            },
            {
              ifTemp: 180,
              nextTemp: 185,
              wait: 5,
            },
            {
              ifTemp: 185,
              nextTemp: 190,
              wait: 5,
            },
            {
              ifTemp: 190,
              nextTemp: 195,
              wait: 5,
            },
            {
              ifTemp: 195,
              nextTemp: 200,
              wait: 5,
            },
            {
              ifTemp: 200,
              nextTemp: MIN_CELSIUS_TEMP,
              wait: 5,
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
        item.type === WorkflowItemTypes.LOOP_UNTIL_TARGET_TEMPERATURE) &&
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
        <div>
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
          </StyledActionTypeHeader>
          <StyledSelect defaultValue={props.item.type} onChange={onChange}>
            <option value={WorkflowItemTypes.HEAT_ON}>Heat On</option>
            <option value={WorkflowItemTypes.FAN_ON}>Fan On</option>
            <option value={WorkflowItemTypes.FAN_ON_GLOBAL}>
              Fan On Global
            </option>
            <option value={WorkflowItemTypes.WAIT}>Pause/Wait</option>
            <option value={WorkflowItemTypes.HEAT_OFF}>Heat Off</option>
            <option value={WorkflowItemTypes.SET_LED_BRIGHTNESS}>
              Set LED Brightness
            </option>
            <option value={WorkflowItemTypes.LOOP_UNTIL_TARGET_TEMPERATURE}>
              Loop Workflow
            </option>
            <option value={WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS}>
              Conditional Temperature Set
            </option>
          </StyledSelect>
        </div>

        {![
          WorkflowItemTypes.HEAT_OFF,
          WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS,
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
          <ConditionalHeatItemEditor />
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
