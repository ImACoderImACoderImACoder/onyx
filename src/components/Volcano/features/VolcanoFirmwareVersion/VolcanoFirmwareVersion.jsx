import proptypes from "prop-types";

function VolcanoFirmwareVersion(props) {
  return <div>Volcano firmware: {props.volcanoFirmwareVersion}</div>;
}

VolcanoFirmwareVersion.propTypes = {
  volcanoFirmwareVersion: proptypes.string,
};

export default VolcanoFirmwareVersion;
