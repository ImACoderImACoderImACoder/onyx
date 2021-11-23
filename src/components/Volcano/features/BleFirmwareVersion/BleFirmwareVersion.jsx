import proptypes from "prop-types";

function BleFirmwareVersion(props) {
  return <div>Ble firmware: {props.bleFirmwareVersion}</div>;
}

BleFirmwareVersion.propTypes = {
  bleFirmwareVersion: proptypes.string,
};

export default BleFirmwareVersion;
