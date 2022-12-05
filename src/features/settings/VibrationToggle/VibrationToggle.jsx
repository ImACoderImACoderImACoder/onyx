import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import { SettingsListDiv } from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";

export default function VibrationToggle(props) {
  return (
    <SettingsListDiv>
      <PrideText text="Vibrate Fan when Volcano reaches temperature" />{" "}
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={props.isVibrationEnabled}
        onChange={props.onChange}
      />
    </SettingsListDiv>
  );
}
