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
import { getCharacteristic } from "../../services/BleCharacteristicCache";
import { useDispatch, useSelector } from "react-redux";
import { setLEDbrightness } from "../settings/settingsSlice";
import { setCurrentWorkflowStepId, setCurrentWorkflow } from "./workflowSlice";
import store from "../../store";

const currentIntervals = [];
const currentSetTimeouts = [];

export default function WorkFlow() {
  const dispatch = useDispatch();
  const workflows = useSelector((state) => state.settings.config.workflows);
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );

  const turnFanOff = async (next) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(fanOffUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
      return next();
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
        case "heatOn": {
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
              return next();
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
            //this set timeout is to allow the volcano to commincate the heat is on. It the volcano doesn't commincate the heat is on we get a lot of button jiggles.
            currentSetTimeouts.push(
              setTimeout(() => {
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
                      //I thought it we read the same temperature 10 times in a row over a second then we should probably reach out to the device.
                      if (sameTemperatureIntervalStreak > 10) {
                        sameTemperatureIntervalStreak = 0;
                        const blePayload = async () => {
                          const temperatureCharacteristic = getCharacteristic(
                            currentTemperatureUuid
                          );
                          const value =
                            await temperatureCharacteristic.readValue();
                          const currentTemperature =
                            convertCurrentTemperatureCharacteristicToCelcius(
                              value
                            );
                          dispatch(setCurrentTemperature(currentTemperature));
                          previousTemperature = currentTemperature;
                          sameTemperatureIntervalStreak = 0;
                        };

                        AddToQueue(blePayload);
                      }
                      if (currentTemperature >= item.payload) {
                        clearIntervals();
                        clearTimeouts();
                        return next();
                      }

                      // if the temperature is changed to be below the target we will never get there.
                      // The workflow must continue onward by any means necessary, therefore we shall set the payload temperature again
                      if (
                        store.getState().deviceInteraction.targetTemperature <
                        item.payload
                      ) {
                        writePayloadTempToDevice();
                      }

                      // What is the heat is turned off?  Again we don't want to be here forever
                      // Sadly this causes button jiggles but I don't think there is a way around that and this should almost never happen with normal use
                      if (!store.getState().deviceInteraction.isHeatOn) {
                        turnHeatOn();
                        dispatch(setIsHeatOn(true));
                      }
                    };
                    AddToQueue(blePayload);
                  }, 100)
                );
              }, 1000)
            );
          };
        }
        case "fanOn": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(fanOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            currentSetTimeouts.push(
              setTimeout(() => {
                turnFanOff(next);
              }, item.payload * 1000)
            );
          };
        }
        case "heatOff": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(heatOffUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            return next();
          };
        }
        case "wait": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            currentSetTimeouts.push(
              setTimeout(() => {
                next();
              }, item.payload * 1000)
            );
          };
        }
        case "setLEDbrightness": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const blePayload = async () => {
              const characteristic = getCharacteristic(LEDbrightnessUuid);
              const buffer = convertToUInt16BLE(item.payload);
              await characteristic.writeValue(buffer);
              dispatch(setLEDbrightness(item.payload));
              return next();
            };

            AddToQueue(blePayload);
          };
        }
        default:
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));
            return next();
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
            buttonText={buttonText}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
