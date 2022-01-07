import { useEffect } from "react";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { currentTemperatureUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import CurrentTemperature from "./CurrentTemperature";
import {
  convertCurrentTemperatureCharacteristicToCelcius,
  getDisplayTemperature,
} from "../../../../services/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTemperature } from "../../../../features/deviceInteraction/deviceInteractionSlice";

export default function CurrentTemperatureContainer() {
  const isF = useSelector((state) => state.settings.isF);
  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const characteristic = getCharacteristic(currentTemperatureUuid);
    const onCharacteristicChange = (event) => {
      const currentTemperature =
        convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
      setCurrentTemperature(currentTemperature);
    };
    const BlePayload = async () => {
      characteristic.addEventListener(
        "characteristicvaluechanged",
        onCharacteristicChange
      );
      characteristic.startNotifications();
      const value = await characteristic.readValue();
      const normalizedValue =
        convertCurrentTemperatureCharacteristicToCelcius(value);
      dispatch(setCurrentTemperature(normalizedValue));
      return "The value of temp read is " + normalizedValue;
    };
    AddToQueue(BlePayload);
    return () => {
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        onCharacteristicChange
      );
    };
  }, [dispatch]);

  const temperature = currentTemperature
    ? getDisplayTemperature(currentTemperature, isF)
    : currentTemperature;

  return <CurrentTemperature currentTemperature={temperature} />;
}
