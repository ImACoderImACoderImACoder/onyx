export default function HeatOn(props) {
  return (
    <div>
      <button onClick={props.onClick}>Heat</button>
      Is heat on: {props.isHeatOn ? "On" : "Off"}
    </div>
  );
}
