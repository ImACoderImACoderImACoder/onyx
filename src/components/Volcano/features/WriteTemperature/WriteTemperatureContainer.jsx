import { useEffect, useRef } from "react";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import {
  bleServerUuid,
  writeTemperatureUuid,
} from "../../../../constants/uuids";
import {
  convertToUInt32BLE,
  convertCurrentTemperatureCharacteristicToCelcius,
  getDisplayTemperature,
  isValueInValidVolcanoCelciusRange,
} from "../../../../services/utils";
import WriteTemperature from "./WriteTemperature";
import {
  MAX_CELSIUS_TEMP,
  DEGREE_SYMBOL,
} from "../../../../constants/temperature";
import { AddToQueue } from "../../../../services/bleQueueing";
import debounce from "lodash/debounce";
import { temperatureIncrementedDecrementedDebounceTime } from "../../../../constants/constants";
export default function WriteTemperatureContainer(props) {
  const { setCurrentTargetTemperature } = props;
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
    (async () => {
      const value = await characteristic.readValue();
      const targetTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(value);
      setCurrentTargetTemperature(targetTemperature);
    })();
    return () => {
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        handleTargetTemperatureChanged
      );
    };
  }, [setCurrentTargetTemperature]);

  // we have to use refs for debounce to work properly in react functional components
  const onTemperatureIncrementDecrementDebounceRef = useRef(
    debounce((newTemp) => {
      onClick(newTemp)();
    }, temperatureIncrementedDecrementedDebounceTime)
  );

  const onClickIncrement = (incrementValue) => () => {
    const nextTemp = props.currentTargetTemperature + incrementValue;
    if (!isValueInValidVolcanoCelciusRange(nextTemp)) {
      return;
    }
    props.setCurrentTargetTemperature(nextTemp);
    onTemperatureIncrementDecrementDebounceRef.current(nextTemp);
  };

  const onClick = (value) => () => {
    if (!isValueInValidVolcanoCelciusRange(value)) {
      return;
    }

    const blePayload = async () => {
      const bleServer = getCharacteristic(bleServerUuid);
      const characteristic = getCharacteristic(writeTemperatureUuid);
      if (bleServer.device.name.includes("S&B VOLCANO")) {
        let buffer = convertToUInt32BLE(value * 10);
        await characteristic.writeValue(buffer);

        props.setCurrentTargetTemperature(value);
        return `Wrote Max temperature of ${value}C to device`;
      }
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
    216,
    226,
    MAX_CELSIUS_TEMP,
  ];
  const temperatureButtons = volcanoClassictemperatures.map((item, index) => {
    return (
      <WriteTemperature
        key={index}
        onClick={onClick(item)}
        buttonText={getDisplayTemperature(item, props.isF)}
        className={
          item === props.currentTargetTemperature
            ? "temperature-write-button-active-temperature"
            : ""
        }
      />
    );
  });
  const temperatureType = props.isF ? "F" : "C";
  const displayTemperatureType = `${DEGREE_SYMBOL}${temperatureType}`;

  temperatureButtons.push(
    <WriteTemperature
      key="decrementTemperatureButton"
      onClick={onClickIncrement(-1)}
      buttonText={`Down one ${displayTemperatureType}`}
    />
  );

  temperatureButtons.push(
    <WriteTemperature
      key="incrementTemperatureButton"
      onClick={onClickIncrement(1)}
      buttonText={`Up one ${displayTemperatureType}`}
    />
  );

  return <div className="temperature-write-div">{temperatureButtons}</div>;
}
