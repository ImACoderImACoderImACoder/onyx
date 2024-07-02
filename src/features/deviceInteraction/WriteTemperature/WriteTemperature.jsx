import { Div } from "./styledComponents";
import { ActiveButton, InactiveButton } from "./styledComponents";

function WriteTemperature(props) {
  const Button = props.isActive ? ActiveButton : InactiveButton;
  const { onClick, buttonText, className, buttonClassName } = {
    ...props,
  };
  return (
    <Div className={className}>
      <Button className={buttonClassName} onClick={onClick}>
        {buttonText}
      </Button>
    </Div>
  );
}

export default WriteTemperature;
