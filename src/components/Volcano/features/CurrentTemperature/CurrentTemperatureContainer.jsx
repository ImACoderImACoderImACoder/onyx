import { useEffect, useState } from "react";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { currentTemperatureUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import CurrentTemperature from "./CurrentTemperature";
import { MIN_CELSIUS_TEMP } from "../../../../constants/temperature";
import {
  convertCurrentTemperatureCharacteristicToCelcius,
  getDisplayTemperature,
} from "../../../../services/utils";

export default function CurrentTemperatureContainer(props) {
  const [currentTemperature, setCurrentTemperature] =
    useState(MIN_CELSIUS_TEMP);
  useEffect(() => {
    const characteristic = getCharacteristic(currentTemperatureUuid);
    const onCharacteristicChange = (event) => {
      const currentTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
      setCurrentTemperature(currentTemperature);
    };
    const BlePayload = {
      then: (resolve) => {
        characteristic.addEventListener(
          "characteristicvaluechanged",
          onCharacteristicChange
        );
        characteristic.startNotifications();
        characteristic.readValue().then((value) => {
          const normalizedValue =
            convertCurrentTemperatureCharacteristicToCelcius(value);
          setCurrentTemperature(normalizedValue);
          resolve("The value of initial temp read is " + value);
        });
      },
    };
    AddToQueue(BlePayload);
    return () => {
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        onCharacteristicChange
      );
    };
  }, []);

  return (
    <CurrentTemperature
      currentTemperature={getDisplayTemperature(currentTemperature, props.isF)}
    />
  );
}
