import Spinner from "react-bootstrap/Spinner";

import styled from "styled-components";
import PrideText from "../../../themes/PrideText";

const Div = styled.div`
  text-align: center;
  font-size: 30px;
  color: ${(props) => props.theme.targetTemperatureColor};
`;

const StyledSpinner = styled(Spinner)`
  text-align: center;
  font-size: 18px;
  color: ${(props) => props.theme.targetTemperatureColor} !important;
`;

const CurrentTargetTemperature = (props) => {
  return (
    <Div>
      {" "}
      {(props.currentTargetTemperature && <PrideText text={`Target Temp: ${props.currentTargetTemperature}`} />) || (
        <StyledSpinner animation="border" variant="dark" />
      )}
    </Div>
  );
};

export default CurrentTargetTemperature;
