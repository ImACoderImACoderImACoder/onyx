import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import PrideText from "../../../themes/PrideText";

const Div = styled.div`
  text-align: center;
  font-size: 30px;
  color: ${(props) => props.theme.currentTemperatureColor};
  font-family: "digital-mono";
  font-size: 4rem;
  margin-bottom: -1.75rem;
`;

const ClickableWrapper = styled.span`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Span = styled.span`
  font-size: 2rem;
  margin-left: 4px;
`;

const StyledSpinner = styled(Spinner)`
  text-align: center;
  font-size: 18px;
  color: ${(props) => props.theme.currentTemperatureColor} !important;
`;

const CurrentTemperature = (props) => {
  return (
    <Div style={props.style}>
      {(props.currentTemperature && (
        <ClickableWrapper onClick={props.onClick}>
          <PrideText text={`${props.currentTemperature}`} />
          <Span>
            <PrideText text={`${props.temperatureSuffix}`} />
          </Span>
        </ClickableWrapper>
      )) || <StyledSpinner animation="border" variant="dark" />}
    </Div>
  );
};

export default CurrentTemperature;
