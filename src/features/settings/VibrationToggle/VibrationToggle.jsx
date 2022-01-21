import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";

export default function VibrationToggle(props) {
  return (
    <Div>
      <h2>Vibrate Fan when Volcano reaches temperature </h2>
      <div onClick={props.onChange}>
        <StyledToggleSwitch isToggleOn={props.isVibrationEnabled} />
      </div>
    </Div>
  );
}
