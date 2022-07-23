import HeatOn from "./HeatOn/HeatOnContainer";
import FanOn from "./FanOn/FanOnContainer";
import CurrentTemperature from "./CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./CurrentTargetTemperature/CurrentTargetTemperatureContainer";
import TargetTemperatureRange from "./TargetTemperatureRange/TargetTemperatureRange";

import WorkFlow from "../workflowEditor/WorkflowButtons";
import Container from "react-bootstrap/Container";

function Volcano() {
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
