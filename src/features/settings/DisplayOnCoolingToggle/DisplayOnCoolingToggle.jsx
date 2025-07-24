import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";

export default function DisplayOnCoolingToggle(props) {
  return (
    <SettingsItem
      title="Display Temperature When Cooling"
      description="Keep the current temperature display active when cooling down."
    >
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={props.isDisplayOnCooling}
        onChange={props.onChange}
      />
    </SettingsItem>
  );
}
