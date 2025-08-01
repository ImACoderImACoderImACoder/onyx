import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import { useTranslation } from "react-i18next";

export default function VibrationToggle(props) {
  const { t } = useTranslation();

  return (
    <SettingsItem
      title={t('settings.items.fanVibrationAlert.title')}
      description={t('settings.items.fanVibrationAlert.description')}
    >
      <StyledToggleSwitch
        onText={t('common.on')}
        offText={<PrideTextWithDiv text={t('common.off')} />}
        isToggleOn={props.isVibrationEnabled}
        onChange={props.onChange}
      />
    </SettingsItem>
  );
}
