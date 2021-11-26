import proptypes from "prop-types";

function BleFirmwareVersion(props) {
  return <div>Ble Firmware: {props.bleFirmwareVersion}</div>;
}

BleFirmwareVersion.propTypes = {
  bleFirmwareVersion: proptypes.string,
};

export default BleFirmwareVersion;
