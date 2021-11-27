export default function HeatOn(props) {
  return (
    <div>
      {props.isFanOn ? " On" : " Off"}
      <button className="heat-air-button" onClick={props.onClick}>
        Fan
      </button>
    </div>
  );
}
