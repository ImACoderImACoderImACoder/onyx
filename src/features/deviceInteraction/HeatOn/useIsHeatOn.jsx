import { useEffect } from "react";
import { register1Uuid } from "../../../constants/uuids";
import { heatingMask } from "../../../constants/masks";
import { useDispatch, useSelector } from "react-redux";
import { setIsHeatOn as setIsHeatOnRedux } from "../deviceInteractionSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useState } from "react";

export default function useIsHeatOn() {
  const [isHeatOn, setIsHeatOn] = useState();
  const dispatch = useDispatch();
  const isHeatOnRedux = useSelector(
    (state) => state.deviceInteraction.isHeatOn
  );

  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const newHeatValue = convertToggleCharacteristicToBool(
        currentVal,
        heatingMask
      );
      dispatch(setIsHeatOnRedux(newHeatValue));
    };
    const characteristicPrj1V = getCharacteristic(register1Uuid);

    const blePayload = async () => {
      await characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
      await characteristicPrj1V.startNotifications();
      //reading this causes an on change event to fire for some unknown reason
      //best to let the change handler pick up the event to prevent duplicate dispatches
      await characteristicPrj1V.readValue();
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

  useEffect(() => {
    setIsHeatOn(isHeatOnRedux);
  }, [isHeatOnRedux]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const characteristicPrj1V = getCharacteristic(register1Uuid);
            //reading this causes an on change event to fire for some unknown reason
            //best to let the change handler pick up the event to prevent duplicate dispatches
            await characteristicPrj1V.readValue();
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

  return isHeatOn;
}
