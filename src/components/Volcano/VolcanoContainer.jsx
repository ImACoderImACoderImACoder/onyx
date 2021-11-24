import propTypes from "prop-types";

import Volcano from "./Volcano";

function VolcanoContainer(props) {
  return (
    <Volcano setBleDevice={props.setBleDevice} bleDevice={props.bleDevice} />
  );
}

VolcanoContainer.propTypes = {
  setBleDevice: propTypes.func.isRequired,
  bleDevice: propTypes.object.isRequired,
};

export default VolcanoContainer;
