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
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../../constants/temperature";
import { AddToQueue } from "../../../../services/bleQueueing";
import CurrentTargetTemperature from "./CurrentTargetTemperature";
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

  const onClick = (value) => () => {
    if (value > MAX_CELSIUS_TEMP || value < MIN_CELSIUS_TEMP) {
      return;
    }

    const blePayload = {
      then: (resolve, reject) => {
        const bleServer = getCharacteristic(bleServerUuid);
        const characteristic = getCharacteristic(writeTemperatureUuid);
        if (bleServer.device.name.includes("S&B VOLCANO")) {
          let buffer = convertToUInt32BLE(value * 10);
          characteristic
            .writeValue(buffer)
            .then((service) => {
              setCurrentTargetTemperature(value);
              resolve(`Wrote Max temperature of ${value}C to device`);
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

  const volcanoClassictemperatures = [
    130,
    142,
    154,
    166,
    178,
    190,
    202,
    214,
    226,
    MAX_CELSIUS_TEMP,
  ];
  const temperatureButtons = volcanoClassictemperatures.map((item) => {
    return (
      <WriteTemperature
        onClick={onClick(item)}
        targetTemperature={getDisplayTemperature(item, props.isF)}
      />
    );
  });
  return (
    <div className="temperature-write-div">
      <CurrentTargetTemperature
        currentTargetTemperature={getDisplayTemperature(
          currentTargetTemperature,
          props.isF
        )}
      />
      {temperatureButtons}
    </div>
  );
}
