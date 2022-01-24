import ToggleSwitch from "../../../../features/shared/styledComponents/Switch";
export default function FanOn(props) {
  return (
    <div className="heat-air-button">
      <ToggleSwitch
        isToggleOn={props.isFanOn}
        onText="Fan On"
        offText="Fan Off"
        onChange={props.onChange}
      />
    </div>
  );
}
