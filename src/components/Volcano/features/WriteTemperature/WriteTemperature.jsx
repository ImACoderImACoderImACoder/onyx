export default function WriteTemperature(props) {
  return (
    <div>
      <button onClick={props.onClick}>Set Max Temp</button>
      <div>Current Target Temp: {props.currentTargetTemperature}</div>
    </div>
  );
}
