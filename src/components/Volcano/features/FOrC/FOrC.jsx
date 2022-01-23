import Div from "../../../../features/settings/Shared/StyledComponents/Div";
import Button from "../../../../features/settings/Shared/StyledComponents/Button";

export default function FOrC(props) {
  return (
    <Div>
      <Button onClick={props.onClick}>
        Change To: {props.temperatureScaleAbbreviation}
      </Button>
    </Div>
  );
}
