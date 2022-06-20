import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText from "../../../themes/PrideText";

export default function DisplayOnCoolingToggle(props) {
  return (
    <Div>
      <h2><PrideText text="Volcano shows temperature when the heat is turned off" /></h2>
      <div onClick={props.onChange}>
        <StyledToggleSwitch onText="On" offText={<div><PrideText text="Off" /></div>} isToggleOn={props.isDisplayOnCooling} />
      </div>
    </Div>
  );
}
