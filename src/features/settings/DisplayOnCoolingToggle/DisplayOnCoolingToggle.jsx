import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import { useTranslation } from "react-i18next";

export default function DisplayOnCoolingToggle(props) {
  const { t } = useTranslation();

  return (
    <SettingsItem
      title={t('settings.items.displayTemperatureWhenCooling.title')}
      description={t('settings.items.displayTemperatureWhenCooling.description')}
    >
      <StyledToggleSwitch
        onText={t('common.on')}
        offText={<PrideTextWithDiv text={t('common.off')} />}
        isToggleOn={props.isDisplayOnCooling}
        onChange={props.onChange}
      />
    </SettingsItem>
  );
}
