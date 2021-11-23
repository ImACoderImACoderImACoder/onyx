import propTypes from "prop-types";
function SerialNumber(props) {
  return <div>Serial Number: {props.serialNumber}</div>;
}

SerialNumber.propTypes = {
  serialNumber: propTypes.string,
};

export default SerialNumber;
