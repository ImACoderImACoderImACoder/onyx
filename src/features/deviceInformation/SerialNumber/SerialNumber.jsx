import propTypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";

function SerialNumber(props) {
  return (
    <DeviceInfoCard
      icon="🔢"
      title="Serial Number"
      value={props.serialNumber}
      description="Unique identifier for your Volcano device"
    />
  );
}

SerialNumber.propTypes = {
  serialNumber: propTypes.string,
};

export default SerialNumber;
