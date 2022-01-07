import Spinner from "react-bootstrap/Spinner";

const CurrentTargetTemperature = (props) => {
  return (
    <div className="temperature-write-header">
      Current Target Temp:{" "}
      {props.currentTargetTemperature || (
        <Spinner animation="border" variant="dark" />
      )}
    </div>
  );
};

export default CurrentTargetTemperature;
