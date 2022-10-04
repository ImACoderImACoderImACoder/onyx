import { useEffect } from "react";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { currentTemperatureUuid } from "../../../constants/uuids";
import { AddToQueue } from "../../../services/bleQueueing";
import CurrentTemperature from "./CurrentTemperature";
import {
  convertCurrentTemperatureCharacteristicToCelcius,
  convertToFahrenheitFromCelsius,
} from "../../../services/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTemperature } from "../deviceInteractionSlice";
import {
  DEGREE_SYMBOL,
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../constants/temperature";
import useIsF from "../../settings/FOrC/UseIsF";
import useIsHeatOn from "../HeatOn/useIsHeatOn";

export default function CurrentTemperatureContainer() {
  const isF = useIsF();
  const isHeatOn = useIsHeatOn();

  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const characteristic = getCharacteristic(currentTemperatureUuid);
            const value = await characteristic.readValue();
            const normalizedValue =
              convertCurrentTemperatureCharacteristicToCelcius(value);
            dispatch(setCurrentTemperature(normalizedValue));
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

  useEffect(() => {
    const characteristic = getCharacteristic(currentTemperatureUuid);
    const onCharacteristicChange = (event) => {
      const currentTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
      dispatch(setCurrentTemperature(currentTemperature));
    };
    const BlePayload = async () => {
      await characteristic.addEventListener(
        "characteristicvaluechanged",
        onCharacteristicChange
      );
      await characteristic.startNotifications();
      const value = await characteristic.readValue();
      const normalizedValue =
        convertCurrentTemperatureCharacteristicToCelcius(value);
      dispatch(setCurrentTemperature(normalizedValue));
    };
    AddToQueue(BlePayload);
    return () => {
      const blePayload = async () => {
        await characteristic?.removeEventListener(
          "characteristicvaluechanged",
          onCharacteristicChange
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch]);

  const temperature =
    currentTemperature || currentTemperature === 0
      ? isF
        ? convertToFahrenheitFromCelsius(currentTemperature)
        : currentTemperature
      : currentTemperature;

  const temperatureSuffix = `${DEGREE_SYMBOL}${isF ? "F" : "C"} `;

  const showCurrentTemp =
    (!isNaN(parseInt(currentTemperature)) &&
      currentTemperature > MIN_CELSIUS_TEMP &&
      currentTemperature <= MAX_CELSIUS_TEMP) ||
    isHeatOn;
  return (
    <CurrentTemperature
      style={{ visibility: !showCurrentTemp && "hidden" }}
      currentTemperature={temperature}
      temperatureSuffix={temperatureSuffix}
    />
  );
}
