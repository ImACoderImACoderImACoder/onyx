export default function CurrentTemperature(props) {
  return (
    <div className="temperature-write-header">
      {"Current Temp: "}
      {props.currentTemperature}
    </div>
  );
}
