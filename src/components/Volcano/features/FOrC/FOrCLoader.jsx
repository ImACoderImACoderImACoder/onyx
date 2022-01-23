import { useEffect } from "react";
import { register2Uuid } from "../../../../constants/uuids";
import { fahrenheitMask } from "../../../../constants/masks";
import Spinner from "react-bootstrap/Spinner";
import {
  convertToggleCharacteristicToBool,
  convertBLEtoUint16,
} from "../../../../services/utils";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { setIsF } from "../../../../features/settings/settingsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export default function FOrCLoader(props) {
  const dispatch = useDispatch();
  const isF = useSelector((state) => state.settings.isF);

  const readFOrCToStore = useCallback(() => {
    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      const convertedValue = convertBLEtoUint16(value);
      const isFValue = convertToggleCharacteristicToBool(
        convertedValue,
        fahrenheitMask
      );
      dispatch(setIsF(isFValue));
    };
    AddToQueue(blePayload);
  }, [dispatch]);

  useEffect(() => {
    if (isF !== undefined) return;

    readFOrCToStore();
  }, [dispatch, isF, readFOrCToStore]);

  useEffect(() => {
    function handlePrj2ChangedVolcano(event) {
      let currentVal = convertBLEtoUint16(event.target.value);
      const changedValue = convertToggleCharacteristicToBool(
        currentVal,
        fahrenheitMask
      );
      if (isF !== changedValue) {
        dispatch(setIsF(changedValue));
      }
    }
    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      await characteristicPrj2V.addEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
      await characteristicPrj2V.startNotifications();
    };

    AddToQueue(blePayload);
    return () => {
      const blePayload = async () => {
        await characteristicPrj2V?.removeEventListener(
          "characteristicvaluechanged",
          handlePrj2ChangedVolcano
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch, isF]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        readFOrCToStore();
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch, readFOrCToStore]);

  const loadingSpinner = props.useSpinnerToShowLoader && (
    <Spinner animation="border" variant="dark" />
  );
  return <>{(isF !== undefined && props.children) || loadingSpinner}</>;
}
