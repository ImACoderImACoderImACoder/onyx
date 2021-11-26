export default function WriteTemperature(props) {
  return (
    <div>
      <button onClick={props.onClick}>
        Set Temp to {props.targetTemperature}
      </button>
    </div>
  );
}
