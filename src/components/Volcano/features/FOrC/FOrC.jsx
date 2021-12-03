export default function FOrC(props) {
  return (
    <div>
      <button className="f-or-c-button" onClick={props.onClick}>
        Change To: {props.temperatureScaleAbbreviation}
      </button>
    </div>
  );
}
