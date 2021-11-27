export default function WriteTemperature(props) {
  return (
    <div className="temperature-write-button-div">
      <button className="temperature-write-button" onClick={props.onClick}>
        Set Temp to {props.targetTemperature}
      </button>
    </div>
  );
}
