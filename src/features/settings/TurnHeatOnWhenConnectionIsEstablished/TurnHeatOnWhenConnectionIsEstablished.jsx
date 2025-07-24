import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";

export default function TurnHeatOnWhenConnectionIsEstablished() {
  const onConnectTurnHeatOn = useSelector(
    (state) => state.settings.config.onConnectTurnHeatOn
  );

  const onChange = () => {
    const config = ReadConfigFromLocalStorage();
    config.onConnectTurnHeatOn = !onConnectTurnHeatOn;
    WriteNewConfigToLocalStorage(config);
  };

  return (
    <SettingsItem
      title="Auto-Start Heating"
      description="Automatically turn on the heater when you connect to your Volcano device, saving you a step."
    >
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={onConnectTurnHeatOn}
        onChange={onChange}
      />
    </SettingsItem>
  );
}
