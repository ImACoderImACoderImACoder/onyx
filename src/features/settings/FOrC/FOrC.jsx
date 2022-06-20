import Div from "../Shared/StyledComponents/Div";
import Button from "../../shared/styledComponents/Button";
import PrideText from "../../../themes/PrideText";
export default function FOrC(props) {
  return (
    <Div>
      <Button onClick={props.onClick}>
        <PrideText text={`Change To: ${props.temperatureScaleAbbreviation}`}/>
      </Button>
    </Div>
  );
}
