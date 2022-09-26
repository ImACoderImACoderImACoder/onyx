import { useEffect } from "react";
import {
  heatOnUuid,
  heatOffUuid,
  register1Uuid,
} from "../../../constants/uuids";
import { heatingMask } from "../../../constants/masks";
import HeatOn from "./HeatOn";
import { useDispatch, useSelector } from "react-redux";
import { setIsHeatOn } from "../deviceInteractionSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import useHeatOnChangedEffect from "./useHeatOnChangedEffect";

export default function HeatOnContainer() {
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const dispatch = useDispatch();
  useHeatOnChangedEffect();
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const characteristicPrj1V = getCharacteristic(register1Uuid);
            const value = await characteristicPrj1V.readValue();
            const currentVal = convertBLEtoUint16(value);
            const newHeatValue = convertToggleCharacteristicToBool(
              currentVal,
              heatingMask
            );
            dispatch(setIsHeatOn(newHeatValue));
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

  const onClick = (nextState) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? heatOnUuid : heatOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);

    //used to prevent a warning I don't fully understand.
    setTimeout(() => dispatch(setIsHeatOn(nextState)), 100);
  };

  return <HeatOn onChange={onClick} isHeatOn={isHeatOn} />;
}
