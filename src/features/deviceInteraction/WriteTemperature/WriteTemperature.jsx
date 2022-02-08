import { Div } from "./styledComponents";
import { ActiveButton, InactiveButton } from "./styledComponents";

function WriteTemperature(props) {
  const Button = props.isActive ? ActiveButton : InactiveButton;

  return (
    <Div className={props.className}>
      <Button onClick={props.onClick}>{props.buttonText}</Button>
    </Div>
  );
}

export default WriteTemperature;
