import Div from "../Shared/StyledComponents/Div";
import Button from "../../shared/styledComponents/Button";
export default function FOrC(props) {
  return (
    <Div>
      <Button onClick={props.onClick}>
        Change To: {props.temperatureScaleAbbreviation}
      </Button>
    </Div>
  );
}
