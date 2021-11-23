export default function Ble(props) {
  return (
    <button onClick={props.onClick}>
      {props.isConnected ? "Connected!" : "Connect"}
    </button>
  );
}
