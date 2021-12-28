import { useEffect, useRef } from "react";
import {
  fanOnUuid,
  fanOffUuid,
  register1Uuid,
} from "../../../../constants/uuids";
import { fanMask } from "../../../../constants/masks";
import FanOn from "./FanOn";
import debounce from "lodash/debounce";
import { bleDebounceTime } from "../../../../constants/constants";
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

export default function FanOnContainer(props) {
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);
  const dispatch = useDispatch();
  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      if (newFanValue !== isFanOn) {
        dispatch(setIsFanOn(newFanValue));
      }
    };

    const characteristicPrj1V = getCharacteristic(register1Uuid);
    const blePayload = async () => {
      characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
      await characteristicPrj1V.startNotifications();
      const value = await characteristicPrj1V.readValue();
      const currentVal = convertBLEtoUint16(value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      if (newFanValue !== isFanOn) {
        dispatch(setIsFanOn(newFanValue));
      }
    };
    AddToQueue(blePayload);

    return () => {
      characteristicPrj1V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
    };
  }, [dispatch, isFanOn]);
  const spaceBarKeycode = 32;

  const onClick = useCallback(() => {
    const blePayload = async () => {
      const targetCharacteristicUuid = isFanOn ? fanOffUuid : fanOnUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
      const newFanValue = !isFanOn;
      return `The fan is now ${newFanValue}`;
    };
    AddToQueue(blePayload);
  }, [isFanOn]);

  const onChange = useCallback(
    (checked) => {
      if (checked === isFanOn) {
        console.log("Fan skipped spam click");
      } else {
        onClickDebounceRef.current(onClick);
      }
    },
    [isFanOn, onClick]
  );

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

  const onClickDebounceRef = useRef(
    debounce(
      (onClick) => {
        onClick();
      },
      bleDebounceTime,
      { isFanOn }
    )
  );

  return <FanOn onChange={onChange} isFanOn={isFanOn} />;
}
