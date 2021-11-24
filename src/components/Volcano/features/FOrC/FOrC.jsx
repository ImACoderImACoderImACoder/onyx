export default function FOrC(props) {
  return (
    <div>
      {props.isF ? "F" : "C"}
      <button onClick={props.onClick}>
        Change To: {props.isF ? "C" : "F"}
      </button>
    </div>
  );
}
