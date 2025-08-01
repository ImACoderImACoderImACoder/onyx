import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";
import { useTranslation } from "react-i18next";

export default function TurnHeatOnWhenConnectionIsEstablished() {
  const { t } = useTranslation();
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
      title={t('settings.items.autoStartHeating.title')}
      description={t('settings.items.autoStartHeating.description')}
    >
      <StyledToggleSwitch
        onText={t('common.on')}
        offText={<PrideTextWithDiv text={t('common.off')} />}
        isToggleOn={onConnectTurnHeatOn}
        onChange={onChange}
      />
    </SettingsItem>
  );
}
