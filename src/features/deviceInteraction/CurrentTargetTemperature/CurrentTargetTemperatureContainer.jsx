import { convertToFahrenheitFromCelsius, convertToUInt32BLE } from "../../../services/utils";
import { useSelector, useDispatch } from "react-redux";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import { register2Uuid } from "../../../constants/uuids";
import { fahrenheitMask, celciusMask } from "../../../constants/masks";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { AddToQueue, AddToPriorityQueue } from "../../../services/bleQueueing";
import { setIsF } from "../../settings/settingsSlice";
import CurrentTargetTemperature from "./CurrentTargetTemperature";

export default function CurrentTargetTemperatureContainer() {
  const dispatch = useDispatch();
  const isF = useSelector((state) => state.settings.isF);
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const temperature = currentTargetTemperature
    ? isF
      ? convertToFahrenheitFromCelsius(currentTargetTemperature)
      : currentTargetTemperature
    : currentTargetTemperature;

  const temperatureSuffix = `${DEGREE_SYMBOL}${isF ? "F" : "C"} `;

  const handleTemperatureUnitToggle = () => {
    const blePayload = async () => {
      try {
        const characteristicPrj2V = getCharacteristic(register2Uuid);
        if (!characteristicPrj2V) {
          console.error("Register2 characteristic not found");
          return;
        }
        
        const mask = isF ? celciusMask : fahrenheitMask;
        const buffer = convertToUInt32BLE(mask);
        await characteristicPrj2V.writeValue(buffer);
        dispatch(setIsF(!isF));
      } catch (error) {
        console.error("Error toggling temperature units:", error);
      }
    };
    AddToPriorityQueue(blePayload);
  };

  return (
    <CurrentTargetTemperature
      style={{ 
        opacity: isHeatOn ? "1" : "0", 
        transition: "all 0.35s"
      }}
      currentTargetTemperature={temperature}
      temperatureSuffix={temperatureSuffix}
      onClick={handleTemperatureUnitToggle}
    />
  );
}
