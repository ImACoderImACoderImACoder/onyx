import proptypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";

function VolcanoFirmwareVersion(props) {
  return (
    <DeviceInfoCard
      icon="🌋"
      title="Volcano Firmware"
      value={props.volcanoFirmwareVersion}
      description="Main device software version"
    />
  );
}

VolcanoFirmwareVersion.propTypes = {
  volcanoFirmwareVersion: proptypes.string,
};

export default VolcanoFirmwareVersion;
