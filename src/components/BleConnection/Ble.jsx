import "./Ble.css";
export default function Ble(props) {
  return (
    <div>
      <button className="connect-button" onClick={props.onClick}>
        Tap anywhere to connect
      </button>
    </div>
  );
}
