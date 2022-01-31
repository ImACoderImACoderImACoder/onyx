import {
  heatOnUuid,
  fanOnUuid,
  fanOffUuid,
  heatOffUuid,
  writeTemperatureUuid,
  currentTemperatureUuid,
} from "../../../constants/uuids";

import {
  convertToUInt8BLE,
  convertToUInt32BLE,
  isValueInValidVolcanoCelciusRange,
  convertCurrentTemperatureCharacteristicToCelcius,
} from "../../../services/utils";
import { AddToQueue, AddToWorkflowQueue } from "../../../services/bleQueueing";
import { setTargetTemperature } from "../../../features/deviceInteraction/deviceInteractionSlice";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useDispatch } from "react-redux";

export default function WorkFlow() {
  const dispatch = useDispatch();

  const workflowTestData = [
    { type: "heatOn", payload: 180 },
    { type: "fanOn", payload: 10 },
    { type: "heatOn", payload: 200 },
    { type: "fanOn", payload: 15 },
    { type: "heatOff" },
    { type: "fanOn", payload: 8 },
    { type: "heatOn", payload: 230 },
    { type: "heatOff" },
  ];

  const workflowTestData2 = [
    { type: "heatOn", payload: 200 },
    { type: "fanOn", payload: 3 },
    { type: "wait", payload: 30 },
    { type: "heatOn", payload: 205 },
    { type: "fanOn", payload: 3 },
    { type: "heatOn", payload: 215 },
    { type: "fanOn", payload: 3 },
    { type: "heatOn", payload: 230 },
    { type: "fanOn", payload: 3 },
    { type: "heatOn", payload: 180 },
    { type: "heatOff" },
  ];

  const workflows = [workflowTestData, workflowTestData2];

  const turnFanOffBlePayload = async (next) => {
    const characteristic = getCharacteristic(fanOffUuid);
    const buffer = convertToUInt8BLE(0);
    await characteristic.writeValue(buffer);
    next();
  };

  const onClick = (workflowIndex) => {
    const thoughtData = workflows[workflowIndex].map((item) => {
      switch (item.type) {
        case "heatOn": {
          return async (next) => {
            const characteristic = getCharacteristic(heatOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            const temperatureCharacteristic = getCharacteristic(
              currentTemperatureUuid
            );
            const onCharacteristicChange = (event) => {
              const currentTemperature =
                convertCurrentTemperatureCharacteristicToCelcius(
                  event.target.value
                );

              if (currentTemperature >= item.payload) {
                next();
                temperatureCharacteristic.removeEventListener(
                  "characteristicvaluechanged",
                  onCharacteristicChange
                );
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
              }
            }
          };
        }
        case "fanOn": {
          return async (next) => {
            const characteristic = getCharacteristic(fanOnUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            setTimeout(() => {
              AddToQueue(async () => turnFanOffBlePayload(next));
            }, item.payload * 1000);
          };
        }
        case "heatOff": {
          return async (next) => {
            const characteristic = getCharacteristic(heatOffUuid);
            const buffer = convertToUInt8BLE(0);
            await characteristic.writeValue(buffer);
            next();
          };
        }
        case "wait": {
          return async (next) => {
            setTimeout(() => next(), item.payload * 1000);
          };
        }
        default:
          return async (next) => next();
      }
    });

    AddToWorkflowQueue(thoughtData);
  };

  return workflows.map((_, index) => (
    <button
      key={index}
      onClick={() => onClick(index)}
    >{`Workflow #${index}`}</button>
  ));
}
