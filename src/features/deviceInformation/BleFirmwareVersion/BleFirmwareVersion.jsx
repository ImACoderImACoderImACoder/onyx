import proptypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";
import { useTranslation } from "react-i18next";

function BleFirmwareVersion(props) {
  const { t } = useTranslation();

  return (
    <DeviceInfoCard
      icon="📡"
      title={t('settings.items.bluetoothFirmware.title')}
      value={props.bleFirmwareVersion}
      description={t('settings.items.bluetoothFirmware.description')}
    />
  );
}

BleFirmwareVersion.propTypes = {
  bleFirmwareVersion: proptypes.string,
};

export default BleFirmwareVersion;
