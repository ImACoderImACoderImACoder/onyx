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
import { MAX_CELSIUS_TEMP } from "../../../../constants/temperature";
import { AddToQueue } from "../../../../services/bleQueueing";
import debounce from "lodash/debounce";
import { temperatureIncrementedDecrementedDebounceTime } from "../../../../constants/constants";
import { useSelector } from "react-redux";
export default function WriteTemperatureContainer(props) {
  const isF = useSelector((state) => state.settings.isF);
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

    (async () => {
      characteristic.startNotifications();
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

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        const characteristic = getCharacteristic(writeTemperatureUuid);
        (async () => {
          const value = await characteristic.readValue();
          const targetTemperature =
            convertCurrentTemperatureCharacteristicToCelcius(value);
          setCurrentTargetTemperature(targetTemperature);
        })();
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
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
    180,
    185,
    190,
    195,
    200,
    206,
    212,
    220,
    226,
    MAX_CELSIUS_TEMP,
  ];
  const temperatureButtons = volcanoClassictemperatures.map((item, index) => {
    return (
      <WriteTemperature
        key={index}
        onClick={onClick(item)}
        buttonText={getDisplayTemperature(item, isF)}
        className={
          item === props.currentTargetTemperature
            ? "temperature-write-button-active-temperature"
            : ""
        }
      />
    );
  });

  temperatureButtons.push(
    <WriteTemperature
      key="decrementTemperatureButton"
      onClick={onClickIncrement(-1)}
      buttonText={
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="minus"
          className="svg-inline--fa fa-minus fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
          ></path>
        </svg>
      }
    />
  );

  temperatureButtons.push(
    <WriteTemperature
      key="incrementTemperatureButton"
      onClick={onClickIncrement(1)}
      buttonText={
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="plus"
          className="svg-inline--fa fa-plus fa-w-14"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
          ></path>
        </svg>
      }
    />
  );

  return <div className="temperature-write-div">{temperatureButtons}</div>;
}
