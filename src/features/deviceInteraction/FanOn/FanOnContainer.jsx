import { useEffect } from "react";
import { fanOnUuid, fanOffUuid, register1Uuid } from "../../../constants/uuids";
import { fanMask } from "../../../constants/masks";
import FanOn from "./FanOn";
import { useDispatch, useSelector } from "react-redux";
import { setIsFanOn } from "../deviceInteractionSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useCallback } from "react";
import { useRef } from "react";

export default function FanOnContainer() {
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);
  const dispatch = useDispatch();

  useEffect(() => {
    const blePayload = async () => {
      const characteristicPrj1V = getCharacteristic(register1Uuid);
      const value = await characteristicPrj1V.readValue();
      const currentVal = convertBLEtoUint16(value);
      const initialFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      dispatch(setIsFanOn(initialFanValue));
    };
    AddToQueue(blePayload);
  }, [dispatch]);

  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      const currentVal = convertBLEtoUint16(event.target.value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      dispatch(setIsFanOn(newFanValue));
    };
    const characteristicPrj1V = getCharacteristic(register1Uuid);
    const blePayload = async () => {
      await characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
      await characteristicPrj1V.startNotifications();
    };

    AddToQueue(blePayload);
    return () => {
      const blePayload = async () => {
        await characteristicPrj1V?.removeEventListener(
          "characteristicvaluechanged",
          handlePrj1ChangedVolcano
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch]);

  const onClick = useCallback((nextState) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? fanOnUuid : fanOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  }, []);

  const fanOnRef = useRef(null);
  const spaceBarKeycode = 32;
  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === spaceBarKeycode) {
        fanOnRef.current.click();
      }
    };
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, [onClick]);

  return <FanOn ref={fanOnRef} onChange={onClick} isFanOn={isFanOn} />;
}
