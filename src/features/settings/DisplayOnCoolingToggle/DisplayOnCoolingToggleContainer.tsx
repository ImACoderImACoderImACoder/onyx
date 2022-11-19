import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../hooks/ts/wrappers";
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

    const blePayload = async () => {
      if (isDisplayOnCooling !== undefined) {
        return;
      }

      const value = await characteristic.readValue();
      const currentVal = convertBLEtoUint16(value);

      const initialState = !convertToggleCharacteristicToBool(
        currentVal,
        displayOnCoolingMask
      );
      dispatch(setIsDisplayOnCooling(initialState));
    };
    AddToQueue(blePayload);
  }, [dispatch, isDisplayOnCooling]);

  const onChange = () => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(register2Uuid);
      const nextState = !isDisplayOnCooling;
      const value = nextState ? displayOnCoolingMask : displayOffCoolingMask;
      const buffer = convertToUInt32BLE(value);
      await characteristic.writeValue(buffer);
      dispatch(setIsDisplayOnCooling(nextState));
    };

    AddToQueue(blePayload);
  };

  return (
    <DisplayOnCoolingToggle
      onChange={onChange}
      isDisplayOnCooling={isDisplayOnCooling || false}
    />
  );
}
