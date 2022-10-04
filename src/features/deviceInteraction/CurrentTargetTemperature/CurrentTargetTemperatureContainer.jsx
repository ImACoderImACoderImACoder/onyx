import { convertToFahrenheitFromCelsius } from "../../../services/utils";
import { useSelector } from "react-redux";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import CurrentTargetTemperature from "./CurrentTargetTemperature";
import useIsF from "../../settings/FOrC/UseIsF";
import useIsHeatOn from "../../deviceInteraction/HeatOn/useIsHeatOn";

export default function CurrentTargetTemperatureContainer() {
  const isF = useIsF();
  const isHeatOn = useIsHeatOn();

  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const temperature = currentTargetTemperature
    ? isF
      ? convertToFahrenheitFromCelsius(currentTargetTemperature)
      : currentTargetTemperature
    : currentTargetTemperature;

  const temperatureSuffix = `${DEGREE_SYMBOL}${isF ? "F" : "C"} `;
  return (
    <CurrentTargetTemperature
      style={{ visibility: !isHeatOn && "hidden" }}
      currentTargetTemperature={temperature}
      temperatureSuffix={temperatureSuffix}
    />
  );
}
