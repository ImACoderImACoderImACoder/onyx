import {
  heatOnUuid,
  fanOnUuid,
  fanOffUuid,
  heatOffUuid,
  writeTemperatureUuid,
  LEDbrightnessUuid,
  currentTemperatureUuid,
} from "../../constants/uuids";

import WriteTemperature from "../deviceInteraction/WriteTemperature/WriteTemperature";
import {
  convertToUInt8BLE,
  convertToUInt32BLE,
  convertToUInt16BLE,
  isValueInValidVolcanoCelciusRange,
  convertCurrentTemperatureCharacteristicToCelcius,
} from "../../services/utils";
import {
  AddToQueue,
  AddToWorkflowQueue,
  ClearWorkflowQueue,
} from "../../services/bleQueueing";
import {
  setCurrentTemperature,
  setIsHeatOn,
  setTargetTemperature,
} from "../deviceInteraction/deviceInteractionSlice";
import WorkflowItemTypes from "../../constants/enums";
import { getCharacteristic } from "../../services/BleCharacteristicCache";
import { useDispatch, useSelector } from "react-redux";
import { setLEDbrightness } from "../settings/settingsSlice";
import {
  setCurrentWorkflowStepId,
  setCurrentWorkflow,
  setCurrentStepEllapsedTimeInSeconds,
} from "./workflowSlice";
import store from "../../store";
import PrideText from "../../themes/PrideText";

const currentIntervals = [];
const currentSetTimeouts = [];

export default function WorkFlow() {
  const dispatch = useDispatch();
  const fanOnGlobal = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal
  );
  const workflows = useSelector(
    (state) => state.settings.config.workflows.items
  );
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );

  const executeWithManagedSetTimeout = (func, timeout = 100) => {
    currentSetTimeouts.push(
      setTimeout(() => {
        func();
      }, timeout)
    );
  };

  const turnFanOff = async (next) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(fanOffUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);

      executeWithManagedSetTimeout(next);
    };
    AddToQueue(blePayload);
  };

  const clearIntervals = () => {
    while (currentIntervals.length > 0) {
      clearInterval(currentIntervals.pop());
    }
  };

  const clearTimeouts = () => {
    while (currentSetTimeouts.length > 0) {
      clearTimeout(currentSetTimeouts.pop());
    }
  };
  const cancelCurrentWorkflow = () => {
    clearIntervals();
    clearTimeouts();
    ClearWorkflowQueue();
    dispatch(setCurrentWorkflowStepId());
    dispatch(setCurrentWorkflow());
    dispatch(setCurrentStepEllapsedTimeInSeconds(0));
    const blePayload = async () => {
      const fanOffCharacteristic = getCharacteristic(fanOffUuid);
      const buffer = convertToUInt8BLE(0);
      await fanOffCharacteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  };

  const onClick = (workflowIndex) => {
    const nextWorkflow = workflows[workflowIndex];
    const isCancelRequest = nextWorkflow.id === currentWorkflow?.id;
    cancelCurrentWorkflow();
    if (isCancelRequest) {
      return;
    }

    dispatch(setCurrentWorkflow(nextWorkflow));
    const thoughtData = nextWorkflow.payload.map((item) => {
      switch (item.type) {
        case WorkflowItemTypes.HEAT_ON: {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const turnHeatOn = () => {
              const blePayload = async () => {
                const characteristic = getCharacteristic(heatOnUuid);
                const buffer = convertToUInt8BLE(0);
                await characteristic.writeValue(buffer);
              };
              AddToQueue(blePayload);
            };

            if (isNaN(item.payload)) {
              turnHeatOn();
              executeWithManagedSetTimeout(next);
            }

            const writePayloadTempToDevice = () => {
              const blePayload = async () => {
                if (isValueInValidVolcanoCelciusRange(item.payload)) {
                  const characteristic =
                    getCharacteristic(writeTemperatureUuid);
                  const buffer = convertToUInt32BLE(item.payload * 10);
                  await characteristic.writeValue(buffer);
                  dispatch(setTargetTemperature(item.payload));
                }
              };

              AddToQueue(blePayload);
            };

            writePayloadTempToDevice();
            turnHeatOn();
            let previousTemperature;
            let sameTemperatureIntervalStreak;
            currentIntervals.push(
              setInterval(() => {
                const blePayload = async () => {
                  const currentTemperature =
                    store.getState().deviceInteraction.currentTemperature;

                  if (previousTemperature !== currentTemperature) {
                    previousTemperature = currentTemperature;
                    sameTemperatureIntervalStreak = 0;
                  } else {
                    sameTemperatureIntervalStreak++;
                  }

                  //this is arbitrary.  If the on change event is missed heat will hang forever waiting for the target temperature to be reach (even tho it is on the device)
                  //I thought it we read the same temperature 7 times in a row then we should probably reach out to the device.
                  if (sameTemperatureIntervalStreak > 7) {
                    sameTemperatureIntervalStreak = 0;
                    const blePayload = async () => {
                      const temperatureCharacteristic = getCharacteristic(
                        currentTemperatureUuid
                      );
                      const value = await temperatureCharacteristic.readValue();
                      const currentTemperature =
                        convertCurrentTemperatureCharacteristicToCelcius(value);
                      dispatch(setCurrentTemperature(currentTemperature));
                      previousTemperature = currentTemperature;
                      sameTemperatureIntervalStreak = 0;
                    };

                    AddToQueue(blePayload);
                  }
                  if (currentTemperature >= item.payload) {
                    clearIntervals();
                    clearTimeouts();
                    executeWithManagedSetTimeout(next);
                  }

                  // if the temperature is changed to be below the target we will never get there.
                  // The workflow must continue onward by any means necessary, therefore we shall set the payload temperature again
                  if (
                    store.getState().deviceInteraction.targetTemperature <
                    item.payload
                  ) {
                    writePayloadTempToDevice();
                  }

                  if (!store.getState().deviceInteraction.isHeatOn) {
                    turnHeatOn();
                    dispatch(setIsHeatOn(true));
                  }
                };
                AddToQueue(blePayload);
              }, 300)
            );
          };
        }
        case WorkflowItemTypes.FAN_ON_GLOBAL:
        case WorkflowItemTypes.FAN_ON: {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(fanOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);

            const fanOnTime =
              item.type === WorkflowItemTypes.FAN_ON_GLOBAL
                ? fanOnGlobal
                : item.payload;
            executeWithManagedSetTimeout(
              () => turnFanOff(next),
              fanOnTime * 1000
            );
          };
        }
        case WorkflowItemTypes.HEAT_OFF: {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(heatOffUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            executeWithManagedSetTimeout(next);
          };
        }
        case WorkflowItemTypes.WAIT: {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            if (item.payload === 0) {
              alert("Click okay to resume the workflow!");
            }

            executeWithManagedSetTimeout(next, item.payload * 1000);
          };
        }
        case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const blePayload = async () => {
              const characteristic = getCharacteristic(LEDbrightnessUuid);
              const buffer = convertToUInt16BLE(item.payload);
              await characteristic.writeValue(buffer);
              dispatch(setLEDbrightness(item.payload));
              executeWithManagedSetTimeout(next, 200);
            };

            AddToQueue(blePayload);
          };
        }
        default:
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));
            executeWithManagedSetTimeout(next);
          };
      }
    });

    AddToWorkflowQueue(thoughtData);
  };

  return (
    <div className="temperature-write-div">
      {workflows.map((item, index) => {
        const isActive = currentWorkflow?.id === item.id;
        const buttonText = isActive ? "Tap to Cancel" : item.name;
        return (
          <WriteTemperature
            key={index}
            onClick={() => onClick(index)}
            buttonText={<PrideText text={buttonText} />}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
