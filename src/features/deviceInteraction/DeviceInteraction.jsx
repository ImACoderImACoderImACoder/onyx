import HeatOn from "./HeatOn/HeatOnContainer";
import FanOn from "./FanOn/FanOnContainer";
import CurrentTemperature from "./CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./WriteTemperature/WriteTemperatureContainer";
import CurrentTargetTemperature from "./CurrentTargetTemperature/CurrentTargetTemperatureContainer";
import TargetTemperatureRange from "./TargetTemperatureRange/TargetTemperatureRange";

import WorkFlow from "../workflowEditor/WorkflowButtons";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Div = styled.div`
  align-self: flex-end;
  justify-content: end;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
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
    <Container style={{ display: "flex" }}>
      <Div>
        <CurrentTemperature />
        <CurrentTargetTemperature />
        <WriteTemperature />
        <WorkFlow />
        <TargetTemperatureRange />
        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </Div>
    </Container>
  );
}

export default Volcano;
