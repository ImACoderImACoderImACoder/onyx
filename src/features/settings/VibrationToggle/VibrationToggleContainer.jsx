import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { vibrationOffMask, vibrationOnMask } from "../../../constants/masks";
import { register3Uuid } from "../../../constants/uuids";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToUInt32BLE,
} from "../../../services/utils";
import { setIsVibrationEnabled } from "../settingsSlice";
import VibrationToggle from "./VibrationToggle";

export default function VibrationToggleContainer() {
  const isVibrationEnabled = useSelector(
    (state) => state.settings.isVibrationEnabled
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isVibrationEnabled !== undefined) {
      return;
    }

    const blePayload = async () => {
      const characteristic = getCharacteristic(register3Uuid);
      const rawValue = await characteristic.readValue();
      const value = convertBLEtoUint16(rawValue);
      const isVibrationEnabled = (value & vibrationOnMask) === 0;
      dispatch(setIsVibrationEnabled(isVibrationEnabled));
      return `The vibration feature is set to ${isVibrationEnabled}`;
    };
    AddToQueue(blePayload);
  }, [dispatch, isVibrationEnabled]);

  const onChange = (checked) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(register3Uuid);
      const value = checked ? vibrationOnMask : vibrationOffMask;
      const buffer = convertToUInt32BLE(value);
      await characteristic.writeValue(buffer);
      dispatch(setIsVibrationEnabled(checked));
    };

    AddToQueue(blePayload);
  };
  return (
    <VibrationToggle
      onChange={onChange}
      isVibrationEnabled={isVibrationEnabled}
    />
  );
}
