import { useEffect, useState } from "react";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import {
  bleServerUuid,
  writeTemperatureUuid,
} from "../../../../constants/uuids";
import {
  convertToUInt32BLE,
  convertCurrentTemperatureCharacteristicToCelcius,
  getDisplayTemperature,
} from "../../../../services/utils";
import WriteTemperature from "./WriteTemperature";
import { MAX_CELSIUS_TEMP } from "../../../../constants/temperature";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function WriteTemperatureContainer(props) {
  const [currentTargetTemperature, setCurrentTargetTemperature] =
    useState(undefined);
  useEffect(() => {
    const characteristic = getCharacteristic(writeTemperatureUuid);

    function handleTargetTemperatureChanged(event) {
      const targetTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
      setCurrentTargetTemperature(targetTemperature);
    }
    characteristic.addEventListener(
      "characteristicvaluechanged",
      handleTargetTemperatureChanged
    );
    characteristic.startNotifications();
    characteristic.readValue().then((value) => {
      const targetTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(value);
      setCurrentTargetTemperature(targetTemperature);
    });
    return () => {
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        handleTargetTemperatureChanged
      );
    };
  }, []);

  const onClick = () => {
    const blePayload = {
      then: (resolve, reject) => {
        const bleServer = getCharacteristic(bleServerUuid);
        const characteristic = getCharacteristic(writeTemperatureUuid);
        if (bleServer.device.name.includes("S&B VOLCANO")) {
          let buffer = convertToUInt32BLE(MAX_CELSIUS_TEMP * 10);
          characteristic
            .writeValue(buffer)
            .then((service) => {
              setCurrentTargetTemperature(MAX_CELSIUS_TEMP);
              resolve(
                `Wrote Max temperature of ${MAX_CELSIUS_TEMP}C to device`
              );
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      },
    };
    AddToQueue(blePayload);
  };

  return (
    <WriteTemperature
      onClick={onClick}
      currentTargetTemperature={getDisplayTemperature(
        currentTargetTemperature,
        props.isF
      )}
    />
  );
}
