import SettingsItem from "../SettingsItem";
import Button from "../../shared/styledComponents/Button";
import PrideText from "../../../themes/PrideText";
import { useTranslation } from "react-i18next";

export default function FOrC(props) {
  const { t } = useTranslation();
  const currentScale =
    props.temperatureScaleAbbreviation === "F" ? t('common.celsius') : t('common.fahrenheit');

  return (
    <SettingsItem
      title={t('settings.items.temperatureScale.title')}
      description={t('settings.items.temperatureScale.description', { current: currentScale })}
    >
      <Button onClick={props.onClick}>
        <PrideText text={t('settings.items.temperatureScale.changeTo', { scale: props.temperatureScaleAbbreviation })} />
      </Button>
    </SettingsItem>
  );
}
