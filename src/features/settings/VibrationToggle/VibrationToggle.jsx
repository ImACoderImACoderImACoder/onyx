import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText from "../../../themes/PrideText";

export default function VibrationToggle(props) {
  return (
    <Div>
      <h2><PrideText text="Vibrate Fan when Volcano reaches temperature"/> </h2>
      <div onClick={props.onChange}>
        <StyledToggleSwitch onText="On" offText={<div><PrideText text="Off" /></div>} isToggleOn={props.isVibrationEnabled} />
      </div>
    </Div>
  );
}
