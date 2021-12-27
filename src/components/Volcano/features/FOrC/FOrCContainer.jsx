import { useEffect } from "react";
import { register2Uuid } from "../../../../constants/uuids";
import { fahrenheitMask, celciusMask } from "../../../../constants/masks";
import {
  convertToggleCharacteristicToBool,
  convertBLEtoUint16,
  convertToUInt32BLE,
} from "../../../../services/utils";
import FOrC from "./FOrCLoader";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { setIsF } from "../../../../features/settings/settingsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function FOrCContainer() {
  const isF = useSelector((state) => state.settings.isF);
  const dispatch = useDispatch();
  useEffect(() => {
    function handlePrj2ChangedVolcano(event) {
      let currentVal = convertBLEtoUint16(event.target.value);
      if (convertToggleCharacteristicToBool(currentVal, fahrenheitMask)) {
        dispatch(setIsF(true));
      } else {
        dispatch(setIsF(false));
      }
    }
    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      let currentVal = convertBLEtoUint16(value);
      characteristicPrj2V.addEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
      characteristicPrj2V.startNotifications();
      const isFValue = convertToggleCharacteristicToBool(
        currentVal,
        fahrenheitMask
      );
      dispatch(setIsF(isFValue));
      return isFValue;
    };
    AddToQueue(blePayload);

    return () => {
      characteristicPrj2V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
    };
  }, [dispatch]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        const blePayload = async () => {
          const characteristicPrj2V = getCharacteristic(register2Uuid);

          const value = await characteristicPrj2V.readValue();
          const currentVal = convertBLEtoUint16(value);
          const isFValue = convertToggleCharacteristicToBool(
            currentVal,
            fahrenheitMask
          );
          dispatch(setIsF(isFValue));
          return isFValue;
        };
        AddToQueue(blePayload);
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch]);

  const onClick = () => {
    if (isF === undefined) {
      return;
    }
    const blePayload = async () => {
      const characteristicPrj2V = getCharacteristic(register2Uuid);
      const mask = isF ? celciusMask : fahrenheitMask;
      const buffer = convertToUInt32BLE(mask);
      await characteristicPrj2V.writeValue(buffer);
      dispatch(setIsF(!isF));
      return `Toggle F or C set to ${isF ? "C" : "F"}`;
    };
    AddToQueue(blePayload);
  };
  const nextTemperatureScaleAbbreviation = isF ? "C" : "F";
  return (
    <FOrC
      isLoading={isF === undefined}
      temperatureScaleAbbreviation={nextTemperatureScaleAbbreviation}
      onClick={onClick}
    />
  );
}
