export default function HeatOn(props) {
  return (
    <div>
      {props.isHeatOn ? " On" : " Off"}
      <button className="heat-air-button" onClick={props.onClick}>
        Heat
      </button>
    </div>
  );
}
