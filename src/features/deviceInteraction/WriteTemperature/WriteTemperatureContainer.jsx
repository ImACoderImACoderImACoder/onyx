import { useEffect, useRef } from "react";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { writeTemperatureUuid, heatOnUuid } from "../../../constants/uuids";
import {
  convertToUInt32BLE,
  convertToUInt8BLE,
  convertCurrentTemperatureCharacteristicToCelcius,
  isValueInValidVolcanoCelciusRange,
} from "../../../services/utils";
import PlusMinusButton from "./PlusMinusButton";
import { AddToQueue } from "../../../services/bleQueueing";
import debounce from "lodash/debounce";
import { temperatureIncrementedDecrementedDebounceTime } from "../../../constants/constants";
import { useSelector } from "react-redux";
import { setIsHeatOn, setTargetTemperature } from "../deviceInteractionSlice";
import { useDispatch } from "react-redux";
import WriteTemperature from "./WriteTemperature";
import { getDisplayTemperature } from "../../../services/utils";
import PrideText from "../../../themes/PrideText";
import useIsHeatOn from "../HeatOn/useIsHeatOn";
import useIsF from "../../settings/FOrC/UseIsF";

export default function WriteTemperatureContainer() {
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const isF = useIsF();
  const isHeatOn = useIsHeatOn();
  const temperatureControlValues = useSelector(
    (state) => state.settings.config.temperatureControlValues
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const characteristic = getCharacteristic(writeTemperatureUuid);

    function handleTargetTemperatureChanged(event) {
      const targetTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
      dispatch(setTargetTemperature(targetTemperature));
    }

    const blePayload = async () => {
      await characteristic.addEventListener(
        "characteristicvaluechanged",
        handleTargetTemperatureChanged
      );

      await characteristic.startNotifications();
      const value = await characteristic.readValue();
      const targetTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(value);
      dispatch(setTargetTemperature(targetTemperature));
    };
    AddToQueue(blePayload);
    return () => {
      const blePayload = async () => {
        await characteristic.removeEventListener(
          "characteristicvaluechanged",
          handleTargetTemperatureChanged
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const characteristic = getCharacteristic(writeTemperatureUuid);
            const value = await characteristic.readValue();
            const targetTemperature =
              convertCurrentTemperatureCharacteristicToCelcius(value);
            dispatch(setTargetTemperature(targetTemperature));
          };
          AddToQueue(blePayload);
        }, 250);
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch]);

  // we have to use refs for debounce to work properly in react functional components
  const onTemperatureIncrementDecrementDebounceRef = useRef(
    debounce((newTemp) => {
      onClick(newTemp)();
    }, temperatureIncrementedDecrementedDebounceTime)
  );

  const onClickIncrement = (incrementValue) => () => {
    const nextTemp = targetTemperature + incrementValue;
    if (!isValueInValidVolcanoCelciusRange(nextTemp)) {
      return;
    }
    dispatch(setTargetTemperature(nextTemp));
    onTemperatureIncrementDecrementDebounceRef.current(nextTemp);
  };

  const onClick = (value) => () => {
    if (!isValueInValidVolcanoCelciusRange(value)) {
      return;
    }

    const blePayload = async () => {
      let characteristic, buffer;

      if (targetTemperature !== value) {
        characteristic = getCharacteristic(writeTemperatureUuid);
        buffer = convertToUInt32BLE(value * 10);
        await characteristic.writeValue(buffer);
        dispatch(setTargetTemperature(value));
      }

      if (!isHeatOn) {
        characteristic = getCharacteristic(heatOnUuid);
        buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
        dispatch(setIsHeatOn(true));
      }
    };
    AddToQueue(blePayload);
  };

  const temperatureButtons = temperatureControlValues.map((item, index) => {
    return (
      <WriteTemperature
        key={index}
        onClick={onClick(item)}
        buttonText={<PrideText text={getDisplayTemperature(item, isF)} />}
        isActive={item === targetTemperature}
      />
    );
  });

  temperatureButtons.unshift(
    <PlusMinusButton
      key="incrementTemperatureButton"
      aria-label="Plus one temperature"
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

  temperatureButtons.unshift(
    <PlusMinusButton
      key="decrementTemperatureButton"
      aria-label="Minus one temperature"
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

  temperatureButtons.push();

  return <div className="temperature-write-div">{temperatureButtons}</div>;
}
