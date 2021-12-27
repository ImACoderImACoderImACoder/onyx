import propTypes from "prop-types";

export default function hoursOfOperation(props) {
  return <div>Hours of Operation: {props.hoursOfOperation}</div>;
}

hoursOfOperation.propTypes = {
  hoursOfOperation: propTypes.string,
};
