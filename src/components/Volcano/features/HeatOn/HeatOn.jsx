import ToggleSwitch from "../../../Switch/Switch";
export default function HeatOn(props) {
  return (
    <div onClick={props.onChange} className="heat-air-button">
      <ToggleSwitch
        isToggleOn={props.isHeatOn}
        onText="Heat On"
        offText="Heat Off"
      />
    </div>
  );
}
