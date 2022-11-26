import HeatOn from "./HeatOn/HeatOnContainer";
import FanOn from "./FanOn/FanOnContainer";
import CurrentTemperature from "./CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./CurrentTargetTemperature/CurrentTargetTemperatureContainer";
import TargetTemperatureRange from "./TargetTemperatureRange/TargetTemperatureRange";

import WorkFlow from "../workflowEditor/WorkflowButtons";
import { useSelector } from "react-redux";

function Volcano() {
  /* eslint-disable no-unused-vars */
  //little hack to make Pridetext reaminate when these states change
  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  /* eslint-enable no-unused-vars */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100% - 66px)",
        justifyContent: "space-between",
      }}
    >
      <div>
        <CurrentTemperature />
        <CurrentTargetTemperature />
        <div
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, auto))",
              gridGap: "10px",
              alignItems: "center",
            }}
          >
            <WriteTemperature />
            <WorkFlow />
          </div>
        </div>
      </div>
      <div>
        <TargetTemperatureRange />
        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </div>
    </div>
  );
}

export default Volcano;
