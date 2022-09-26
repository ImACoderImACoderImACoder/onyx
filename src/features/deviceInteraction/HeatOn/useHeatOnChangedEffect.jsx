import { useEffect } from "react";
import { register1Uuid } from "../../../constants/uuids";
import { heatingMask } from "../../../constants/masks";
import { useDispatch } from "react-redux";
import { setIsHeatOn } from "../deviceInteractionSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";

export default function useHeatOnChangedEffect() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const newHeatValue = convertToggleCharacteristicToBool(
        currentVal,
        heatingMask
      );
      dispatch(setIsHeatOn(newHeatValue));
    };
    const characteristicPrj1V = getCharacteristic(register1Uuid);

    const blePayload = async () => {
      await characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
      await characteristicPrj1V.startNotifications();
      const value = await characteristicPrj1V.readValue();
      const currentVal = convertBLEtoUint16(value);
      const newHeatValue = convertToggleCharacteristicToBool(
        currentVal,
        heatingMask
      );
      dispatch(setIsHeatOn(newHeatValue));
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
}
