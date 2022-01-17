import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";

const Div = styled.div`
  text-align: center;
  font-size: 30px;
  color: ${(props) => props.theme.primaryFontColor};
`;

const StyledSpinner = styled(Spinner)`
  text-align: center;
  font-size: 18px;
  color: ${(props) => props.theme.primaryFontColor} !important;
`;

const CurrentTemperature = (props) => {
  return (
    <Div>
      {"Current Temp: "}
      {props.currentTemperature || (
        <StyledSpinner animation="border" variant="dark" />
      )}
    </Div>
  );
};

export default CurrentTemperature;
