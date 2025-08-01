import propTypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";
import { useTranslation } from "react-i18next";

export default function hoursOfOperation(props) {
  const { t } = useTranslation();

  return (
    <DeviceInfoCard
      icon="⏱️"
      title={t('settings.items.hoursOfOperation.title')}
      value={props.hoursOfOperation}
      description={t('settings.items.hoursOfOperation.description')}
    />
  );
}

hoursOfOperation.propTypes = {
  hoursOfOperation: propTypes.string,
};
