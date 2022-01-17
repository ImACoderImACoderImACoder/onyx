import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToUInt32BLE,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { register2Uuid } from "../../../constants/uuids";
import {
  displayOnCoolingMask,
  displayOffCoolingMask,
} from "../../../constants/masks";
import { setIsDisplayOnCooling } from "../settingsSlice";
import DisplayOnCoolingToggle from "./DisplayOnCoolingToggle";

export default function DisplayOnCoolingToggleContainer() {
  const isDisplayOnCooling = useSelector(
    (state) => state.settings.isDisplayOnCooling
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const characteristic = getCharacteristic(register2Uuid);

    const handleRegister2Change = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const isDisplayOnCooling = !convertToggleCharacteristicToBool(
        currentVal,
        displayOnCoolingMask
      );
      dispatch(setIsDisplayOnCooling(isDisplayOnCooling));
    };
    const blePayload = async () => {
      await characteristic.addEventListener(
        "characteristicvaluechanged",
        handleRegister2Change
      );
      characteristic.startNotifications();
    };
    AddToQueue(blePayload);
    return () => {
      const blePayload = async () => {
        await characteristic?.removeEventListener(
          "characteristicvaluechanged",
          handleRegister2Change
        );
      };

      AddToQueue(blePayload);
    };
  });

  useEffect(() => {
    if (isDisplayOnCooling !== undefined) return;

    const characteristic = getCharacteristic(register2Uuid);

    const blePayload = async () => {
      const value = await characteristic.readValue();
      const currentVal = convertBLEtoUint16(value);

      const isDisplayOnCooling = !convertToggleCharacteristicToBool(
        currentVal,
        displayOnCoolingMask
      );
      dispatch(setIsDisplayOnCooling(isDisplayOnCooling));
    };
    AddToQueue(blePayload);
  }, [isDisplayOnCooling, dispatch]);

  const onChange = (checked) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(register2Uuid);
      const value = checked ? displayOnCoolingMask : displayOffCoolingMask;
      const buffer = convertToUInt32BLE(value);
      await characteristic.writeValue(buffer);
      dispatch(setIsDisplayOnCooling(checked));
    };

    AddToQueue(blePayload);
  };

  return (
    <DisplayOnCoolingToggle
      onChange={onChange}
      isDisplayOnCooling={isDisplayOnCooling}
    />
  );
}
