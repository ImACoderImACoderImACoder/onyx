export default function HeatOn(props) {
  return (
    <div>
      <button onClick={props.onClick}>Heat</button>
      {props.isHeatOn ? " On" : " Off"}
    </div>
  );
}
