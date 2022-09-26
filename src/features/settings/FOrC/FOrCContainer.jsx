import { register2Uuid } from "../../../constants/uuids";
import { fahrenheitMask, celciusMask } from "../../../constants/masks";
import { convertToUInt32BLE } from "../../../services/utils";
import FOrC from "./FOrC";
import { AddToQueue } from "../../../services/bleQueueing";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useDispatch } from "react-redux";
import { setIsF } from "../settingsSlice";
import useIsF from "./UseIsF";

export default function FOrCContainer() {
  const isF = useIsF();
  const dispatch = useDispatch();

  const onClick = () => {
    const blePayload = async () => {
      const characteristicPrj2V = getCharacteristic(register2Uuid);
      const mask = isF ? celciusMask : fahrenheitMask;
      const buffer = convertToUInt32BLE(mask);
      await characteristicPrj2V.writeValue(buffer);
      dispatch(setIsF(!isF));
    };
    AddToQueue(blePayload);
  };

  const nextTemperatureScaleAbbreviation = isF ? "C" : "F";
  return (
    <FOrC
      temperatureScaleAbbreviation={nextTemperatureScaleAbbreviation}
      onClick={onClick}
    />
  );
}
