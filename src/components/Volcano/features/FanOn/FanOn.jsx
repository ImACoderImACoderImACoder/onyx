export default function HeatOn(props) {
  return (
    <div>
      <button onClick={props.onClick}>Fan</button>
      {props.isFanOn ? " On" : " Off"}
    </div>
  );
}
