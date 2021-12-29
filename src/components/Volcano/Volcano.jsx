import { useState } from "react";
import HeatOn from "./features/HeatOn/HeatOnContainer";
import FanOn from "./features/FanOn/FanOnContainer";
import CurrentTemperature from "./features/CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./features/WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./features/WriteTemperature/CurrentTargetTemperature";
import { getDisplayTemperature } from "../../services/utils";

import { useSelector } from "react-redux";

function Volcano() {
  const isF = useSelector((state) => state.settings.isF);
  const [currentTargetTemperature, setCurrentTargetTemperature] =
    useState(undefined);

  return (
    <div>
      <div>
        <CurrentTemperature />
        <CurrentTargetTemperature
          currentTargetTemperature={getDisplayTemperature(
            currentTargetTemperature,
            isF
          )}
        />
        <WriteTemperature
          currentTargetTemperature={currentTargetTemperature}
          setCurrentTargetTemperature={setCurrentTargetTemperature}
        />

        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </div>
    </div>
  );
}

export default Volcano;
