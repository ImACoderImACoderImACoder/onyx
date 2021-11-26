export default function FOrC(props) {
  return (
    <div>
      <button onClick={props.onClick}>
        Change To: {props.temperatureScaleAbbreviation}
      </button>
    </div>
  );
}
