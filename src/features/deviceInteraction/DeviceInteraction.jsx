import HeatOn from "./HeatOn/HeatOnContainer";
import FanOn from "./FanOn/FanOnContainer";
import CurrentTemperature from "./CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./CurrentTargetTemperature/CurrentTargetTemperatureContainer";
import TargetTemperatureRange from "./TargetTemperatureRange/TargetTemperatureRange";

import WorkFlow from "../workflowEditor/WorkflowButtons";
import Container from "react-bootstrap/Container";
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
    <Container>
      <div>
        <CurrentTemperature />
        <CurrentTargetTemperature />
        <WriteTemperature />
        <WorkFlow />
        <TargetTemperatureRange />
        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </div>
    </Container>
  );
}

export default Volcano;
