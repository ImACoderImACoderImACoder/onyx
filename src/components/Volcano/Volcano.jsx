import HeatOn from "./features/HeatOn/HeatOnContainer";
import FanOn from "./features/FanOn/FanOnContainer";
import CurrentTemperature from "./features/CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./features/WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./features/WriteTemperature/CurrentTargetTemperature";
import { getDisplayTemperature } from "../../services/utils";

import { useSelector } from "react-redux";

function Volcano() {
  const isF = useSelector((state) => state.settings.isF);
  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const temperature = currentTargetTemperature
    ? getDisplayTemperature(currentTargetTemperature, isF)
    : currentTargetTemperature;

  return (
    <div>
      <div>
        <CurrentTemperature />
        <CurrentTargetTemperature currentTargetTemperature={temperature} />
        <WriteTemperature currentTargetTemperature={temperature} />

        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </div>
    </div>
  );
}

export default Volcano;
