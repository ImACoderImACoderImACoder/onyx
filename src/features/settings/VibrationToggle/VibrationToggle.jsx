import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";

export default function VibrationToggle(props) {
  return (
    <SettingsItem
      title="Fan Vibration Alert"
      description="The fan will briefly vibrate when your Volcano reaches the target temperature, letting you know it's ready to use."
    >
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={props.isVibrationEnabled}
        onChange={props.onChange}
      />
    </SettingsItem>
  );
}
