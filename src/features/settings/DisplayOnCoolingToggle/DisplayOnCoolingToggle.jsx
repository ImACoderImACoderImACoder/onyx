import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";

export default function DisplayOnCoolingToggle(props) {
  return (
    <Div>
      <h2>
        <PrideText text="Volcano shows temperature when the heat is turned off" />
      </h2>
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={props.isDisplayOnCooling}
        onChange={props.onChange}
      />
    </Div>
  );
}
