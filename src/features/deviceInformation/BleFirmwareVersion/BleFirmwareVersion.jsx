import proptypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";

function BleFirmwareVersion(props) {
  return (
    <DeviceInfoCard
      icon="📡"
      title="Bluetooth Firmware"
      value={props.bleFirmwareVersion}
      description="Bluetooth communication module version"
    />
  );
}

BleFirmwareVersion.propTypes = {
  bleFirmwareVersion: proptypes.string,
};

export default BleFirmwareVersion;
