import Spinner from "react-bootstrap/Spinner";

const CurrentTemperature = (props) => {
  return (
    <div className="temperature-write-header">
      {"Current Temp: "}
      {props.currentTemperature || (
        <Spinner animation="border" variant="dark" />
      )}
    </div>
  );
};

export default CurrentTemperature;
