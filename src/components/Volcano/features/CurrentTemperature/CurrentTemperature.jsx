export default function CurrentTemperature(props) {
  return (
    <div>
      Current Temp: {"\u00B0"}
      {props.currentTemperature}
      {props.temperatureScaleAbbreviation}
    </div>
  );
}
