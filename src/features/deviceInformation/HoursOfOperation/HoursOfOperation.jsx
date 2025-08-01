import propTypes from "prop-types";
import DeviceInfoCard from "../DeviceInfoCard";

export default function hoursOfOperation(props) {
  return (
    <DeviceInfoCard
      icon="⏱️"
      title="Hours of Operation"
      value={props.hoursOfOperation}
      description="Total runtime since device was first used"
    />
  );
}

hoursOfOperation.propTypes = {
  hoursOfOperation: propTypes.string,
};
