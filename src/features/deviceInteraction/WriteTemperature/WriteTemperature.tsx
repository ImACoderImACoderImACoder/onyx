import { Div } from "./styledComponents";
import { ActiveButton, InactiveButton } from "./styledComponents";

interface WriteTemperatureProps {
  isActive: boolean;
  className: string;
  onClick: () => void;
  buttonText: string;
}
function WriteTemperature(props: WriteTemperatureProps) {
  const Button = props.isActive ? ActiveButton : InactiveButton;

  return (
    <Div className={props.className}>
      <Button onClick={props.onClick}>{props.buttonText}</Button>
    </Div>
  );
}

export default WriteTemperature;
