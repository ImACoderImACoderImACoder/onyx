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

export default function FOrCLoader(props) {
  const dispatch = useDispatch();
  const isF = useSelector((state) => state.settings.isF);

  useEffect(() => {
    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      const convertedValue = convertBLEtoUint16(value);
      const isFValue = convertToggleCharacteristicToBool(
        convertedValue,
        fahrenheitMask
      );
      dispatch(setIsF(isFValue));
      return isFValue;
    };
    AddToQueue(blePayload);
  }, [dispatch]);

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
    characteristicPrj2V.addEventListener(
      "characteristicvaluechanged",
      handlePrj2ChangedVolcano
    );
    characteristicPrj2V.startNotifications();

    return () => {
      characteristicPrj2V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
    };
  }, [dispatch, isF]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        const blePayload = async () => {
          const characteristicPrj2V = getCharacteristic(register2Uuid);
          const value = await characteristicPrj2V.readValue();
          const currentVal = convertBLEtoUint16(value);
          const isFValue = convertToggleCharacteristicToBool(
            currentVal,
            fahrenheitMask
          );
          dispatch(setIsF(isFValue));
          return isFValue;
        };
        AddToQueue(blePayload);
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch]);

  const loadingSpinner = props.useSpinnerToShowLoader && (
    <Spinner animation="border" variant="dark" />
  );
  return <>{(isF !== undefined && props.children) || loadingSpinner}</>;
}
