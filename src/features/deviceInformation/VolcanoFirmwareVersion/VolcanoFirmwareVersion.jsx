import proptypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";
import { useTranslation } from "react-i18next";

function VolcanoFirmwareVersion(props) {
  const { t } = useTranslation();

  return (
    <DeviceInfoCard
      icon="🌋"
      title={t('settings.items.volcanoFirmware.title')}
      value={props.volcanoFirmwareVersion}
      description={t('settings.items.volcanoFirmware.description')}
    />
  );
}

VolcanoFirmwareVersion.propTypes = {
  volcanoFirmwareVersion: proptypes.string,
};

export default VolcanoFirmwareVersion;
