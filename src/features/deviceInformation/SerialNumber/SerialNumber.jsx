import propTypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";
import { useTranslation } from "react-i18next";

function SerialNumber(props) {
  const { t } = useTranslation();

  return (
    <DeviceInfoCard
      icon="🔢"
      title={t('settings.items.serialNumber.title')}
      value={props.serialNumber}
      description={t('settings.items.serialNumber.description')}
    />
  );
}

SerialNumber.propTypes = {
  serialNumber: propTypes.string,
};

export default SerialNumber;
