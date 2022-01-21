import ToggleSwitch from "../../../Switch/Switch";
export default function FanOn(props) {
  return (
    <div onClick={props.onChange} className="heat-air-button">
      <ToggleSwitch
        isToggleOn={props.isFanOn}
        onText="Fan On"
        offText="Fan Off"
      />
    </div>
  );
}
