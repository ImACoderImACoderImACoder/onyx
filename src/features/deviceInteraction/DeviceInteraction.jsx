import HeatOn from "./HeatOn/HeatOnContainer";
import FanOn from "./FanOn/FanOnContainer";
import CurrentTemperature from "./CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./WriteTemperature/CurrentTargetTemperature";
import { getDisplayTemperature } from "../../services/utils";
import TargetTemperatureRange from "./TargetTemperatureRange/TargetTemperatureRange";

import { useSelector } from "react-redux";
import WorkFlow from "../workflowEditor/WorkflowButtons";
import Container from "react-bootstrap/Container";

function Volcano() {
  const isF = useSelector((state) => state.settings.isF);
  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const temperature = currentTargetTemperature
    ? getDisplayTemperature(currentTargetTemperature, isF)
    : currentTargetTemperature;

  return (
    <Container>
      <div>
        <CurrentTemperature />
        <CurrentTargetTemperature currentTargetTemperature={temperature} />
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
