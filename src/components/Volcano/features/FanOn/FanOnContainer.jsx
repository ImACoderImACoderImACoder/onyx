import { useEffect, useRef } from "react";
import {
  fanOnUuid,
  fanOffUuid,
  register1Uuid,
} from "../../../../constants/uuids";
import { fanMask } from "../../../../constants/masks";
import FanOn from "./FanOn";
import { useDispatch, useSelector } from "react-redux";
import { setIsFanOn } from "../../../../features/deviceInteraction/deviceInteractionSlice";
import { AddToQueue } from "../../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../../services/utils";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { useCallback } from "react";

export default function FanOnContainer() {
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);
  const isDisabled = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const blePayload = async () => {
      const characteristicPrj1V = getCharacteristic(register1Uuid);
      const value = await characteristicPrj1V.readValue();
      const currentVal = convertBLEtoUint16(value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      dispatch(setIsFanOn(newFanValue));
    };
    AddToQueue(blePayload);
  }, [dispatch]);

  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      dispatch(setIsFanOn(newFanValue));
      isDisabled.current = false;
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
  const spaceBarKeycode = 32;

  const onClick = useCallback(() => {
    if (isDisabled.current) {
      console.log("Spam click prevented on fan");
      return;
    }
    dispatch(setIsFanOn(!isFanOn));
    isDisabled.current = true;
    const blePayload = async () => {
      const targetCharacteristicUuid = isFanOn ? fanOffUuid : fanOnUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
      const newFanValue = !isFanOn;
      return `The fan is now ${newFanValue}`;
    };
    AddToQueue(blePayload);
  }, [isFanOn, isDisabled, dispatch]);

  const onChange = useCallback(() => {
    onClick();
  }, [onClick]);

  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === spaceBarKeycode) {
        onChange(!isFanOn);
      }
    };
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, [onChange, isFanOn]);

  return (
    <FanOn
      onChange={onChange}
      isFanOn={isFanOn}
      isLoading={isDisabled.current}
    />
  );
}
