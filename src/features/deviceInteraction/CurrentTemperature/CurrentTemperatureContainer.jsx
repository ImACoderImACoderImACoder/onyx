import { useEffect } from "react";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { currentTemperatureUuid, register2Uuid } from "../../../constants/uuids";
import { AddToQueue, AddToPriorityQueue } from "../../../services/bleQueueing";
import CurrentTemperature from "./CurrentTemperature";
import {
  convertCurrentTemperatureCharacteristicToCelcius,
  convertToFahrenheitFromCelsius,
  convertToUInt32BLE,
} from "../../../services/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTemperature } from "../deviceInteractionSlice";
import { setIsF } from "../../settings/settingsSlice";
import {
  DEGREE_SYMBOL,
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../constants/temperature";
import { fahrenheitMask, celciusMask } from "../../../constants/masks";
import store from "../../../store";

export default function CurrentTemperatureContainer() {
  const isF = useSelector((state) => state.settings.isF);
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

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
            if (
              store.getState().deviceInteraction.currentTemperature !==
              normalizedValue
            ) {
              dispatch(setCurrentTemperature(normalizedValue));
            }
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
      if (
        store.getState().deviceInteraction.currentTemperature !==
        currentTemperature
      ) {
        dispatch(setCurrentTemperature(currentTemperature));
      }
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

      if (
        store.getState().deviceInteraction.currentTemperature !==
        normalizedValue
      ) {
        dispatch(setCurrentTemperature(normalizedValue));
      }
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

  const handleTemperatureUnitToggle = () => {
    const blePayload = async () => {
      try {
        const characteristicPrj2V = getCharacteristic(register2Uuid);
        if (!characteristicPrj2V) {
          console.error("Register2 characteristic not found");
          return;
        }
        
        const mask = isF ? celciusMask : fahrenheitMask;
        const buffer = convertToUInt32BLE(mask);
        await characteristicPrj2V.writeValue(buffer);
        dispatch(setIsF(!isF));
      } catch (error) {
        console.error("Error toggling temperature units:", error);
      }
    };
    AddToPriorityQueue(blePayload);
  };

  return (
    <CurrentTemperature
      style={{ 
        opacity: showCurrentTemp ? "1" : "0", 
        transition: "all 0.35s"
      }}
      currentTemperature={temperature}
      temperatureSuffix={temperatureSuffix}
      onClick={handleTemperatureUnitToggle}
    />
  );
}
