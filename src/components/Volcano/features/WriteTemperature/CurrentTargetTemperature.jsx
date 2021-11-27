export default function currentTargetTemperature(props) {
  return (
    <div className="temperature-write-header">
      Current Target Temp: {props.currentTargetTemperature}
    </div>
  );
}
