const CurrentTargetTemperature = (props) => {
  return (
    <div className="temperature-write-header">
      Current Target Temp: {props.currentTargetTemperature}
    </div>
  );
};

export default CurrentTargetTemperature;
