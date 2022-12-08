import Spinner from "react-bootstrap/Spinner";
import { DEGREE_SYMBOL } from "../../../constants/temperature";
import styled from "styled-components";
import PrideText from "../../../themes/PrideText";
import { TemperatureUnit } from "../../../constants/constants";
import { CSSProperties } from "react";

const Div = styled.div`
  text-align: center;
  font-size: 30px;
  color: ${(props) => props.theme.targetTemperatureColor};
  font-family: "digital-mono";
  font-size: 4rem;
`;

const Span = styled.span`
  font-size: 2rem;
  margin-left: 4px;
`;

const StyledSpinner = styled(Spinner)`
  text-align: center;
  font-size: 18px;
  color: ${(props) => props.theme.targetTemperatureColor} !important;
`;

interface CurrentTargetTemperatureProps {
  style: CSSProperties;
  currentTargetTemperature: number;
  temperatureUnit: TemperatureUnit;
  isLoading: boolean;
}

const CurrentTargetTemperature = (props: CurrentTargetTemperatureProps) => {
  const { style, currentTargetTemperature, temperatureUnit, isLoading } = props;

  return (
    <Div style={style}>
      {(!isLoading && (
        <div>
          <PrideText text={`${currentTargetTemperature}`} />
          <Span>
            <PrideText
              text={`${DEGREE_SYMBOL}${
                temperatureUnit === TemperatureUnit.F ? "F" : "C"
              }`}
            />
          </Span>
        </div>
      )) || <StyledSpinner animation="border" variant="dark" />}
    </Div>
  );
};

export default CurrentTargetTemperature;
