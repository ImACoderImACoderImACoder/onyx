import {
  heatOnUuid,
  fanOnUuid,
  fanOffUuid,
  heatOffUuid,
  writeTemperatureUuid,
  currentTemperatureUuid,
  LEDbrightnessUuid,
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
import { setTargetTemperature } from "../deviceInteraction/deviceInteractionSlice";
import { getCharacteristic } from "../../services/BleCharacteristicCache";
import { useDispatch, useSelector } from "react-redux";
import { setLEDbrightness } from "../settings/settingsSlice";
import { setCurrentWorkflowStepId, setCurrentWorkflow } from "./workflowSlice";

export default function WorkFlow() {
  const dispatch = useDispatch();
  const workflows = useSelector((state) => state.settings.config.workflows);
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );
  const turnFanOffBlePayload = async (next) => {
    const characteristic = getCharacteristic(fanOffUuid);
    const buffer = convertToUInt8BLE(0);
    await characteristic.writeValue(buffer);
    next();
  };

  const cancelCurrentWorkflow = () => {
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
    if (nextWorkflow.id === currentWorkflow?.id) {
      cancelCurrentWorkflow();
      return;
    }
    dispatch(setCurrentWorkflow(nextWorkflow));
    const thoughtData = nextWorkflow.payload.map((item) => {
      switch (item.type) {
        case "heatOn": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));
            const characteristic = getCharacteristic(heatOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            const temperatureCharacteristic = getCharacteristic(
              currentTemperatureUuid
            );
            const onCharacteristicChange = async (event) => {
              const currentTemperature =
                convertCurrentTemperatureCharacteristicToCelcius(
                  event.target.value
                );

              if (currentTemperature >= item.payload) {
                await temperatureCharacteristic.removeEventListener(
                  "characteristicvaluechanged",
                  onCharacteristicChange
                );
                next();
              }
            };

            if (isValueInValidVolcanoCelciusRange(item.payload)) {
              const characteristic = getCharacteristic(writeTemperatureUuid);
              const buffer = convertToUInt32BLE(item.payload * 10);

              const value = await temperatureCharacteristic.readValue();
              const currentTemperature =
                convertCurrentTemperatureCharacteristicToCelcius(value);

              await characteristic.writeValue(buffer);
              dispatch(setTargetTemperature(item.payload));

              if (currentTemperature >= item.payload) {
                next();
              } else {
                await temperatureCharacteristic.addEventListener(
                  "characteristicvaluechanged",
                  onCharacteristicChange
                );
                await characteristic.startNotifications();
                const handler = async () => {
                  if (document.visibilityState === "visible") {
                    const blePayload = async () => {
                      const value = await temperatureCharacteristic.readValue();
                      const currentTemperature =
                        convertCurrentTemperatureCharacteristicToCelcius(value);
                      if (currentTemperature >= item.payload) {
                        document.removeEventListener("visibilitychange", this);
                        await temperatureCharacteristic.removeEventListener(
                          "characteristicvaluechanged",
                          onCharacteristicChange
                        );
                        next();
                      }
                    };
                    AddToQueue(blePayload);
                  }
                };
                document.addEventListener("visibilitychange", handler);
              }
            } else {
              next();
            }
          };
        }
        case "fanOn": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(fanOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            setTimeout(() => {
              AddToQueue(async () => await turnFanOffBlePayload(next));
            }, item.payload * 1000);
          };
        }
        case "heatOff": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(heatOffUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            next();
          };
        }
        case "wait": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            setTimeout(() => next(), item.payload * 1000);
          };
        }
        case "setLEDbrightness": {
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));

            const characteristic = getCharacteristic(LEDbrightnessUuid);
            const buffer = convertToUInt16BLE(item.payload);
            await characteristic.writeValue(buffer);
            dispatch(setLEDbrightness(item.payload));
            next();
          };
        }
        default:
          return async (next) => {
            dispatch(setCurrentWorkflowStepId(item.id));
            next();
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
