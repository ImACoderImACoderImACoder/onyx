import { useEffect } from "react";
import { fanOnUuid, fanOffUuid, register1Uuid } from "../../../constants/uuids";
import { fanMask } from "../../../constants/masks";
import FanOn from "./FanOn";
import { useDispatch, useSelector } from "react-redux";
import { setIsFanOn } from "../deviceInteractionSlice";
import { AddToQueue, AddToPriorityQueue } from "../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useCallback } from "react";
import { useRef } from "react";
import store from "../../../store";

export default function FanOnContainer() {
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFanOn === undefined) {
      const blePayload = async () => {
        const characteristicPrj1V = getCharacteristic(register1Uuid);
        const value = await characteristicPrj1V.readValue();
        const currentVal = convertBLEtoUint16(value);
        const initialFanValue = convertToggleCharacteristicToBool(
          currentVal,
          fanMask
        );
        if (store.getState().deviceInteraction.isFanOn !== initialFanValue) {
          dispatch(setIsFanOn(initialFanValue));
        }
      };
      AddToQueue(blePayload);
    }
  }, [dispatch, isFanOn]);

  const onClick = useCallback((nextState) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? fanOnUuid : fanOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
    };
    AddToPriorityQueue(blePayload);
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
