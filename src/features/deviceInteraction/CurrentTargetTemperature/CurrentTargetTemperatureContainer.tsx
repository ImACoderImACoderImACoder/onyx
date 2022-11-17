import { convertToFahrenheitFromCelsius } from "../../../services/utils";
import { useSelector } from "../../../hooks/ts/wrappers";
import CurrentTargetTemperature from "./CurrentTargetTemperature";
import React from "react";
import { TemperatureUnit } from "../../../constants/constants";

export default function CurrentTargetTemperatureContainer() {
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

  return (
    <CurrentTargetTemperature
      style={{ opacity: isHeatOn ? "1" : "0", transition: "all 0.35s" }}
      currentTargetTemperature={temperature || 0}
      temperatureUnit={isF ? TemperatureUnit.F : TemperatureUnit.C}
      isLoading={!temperature}
    />
  );
}
