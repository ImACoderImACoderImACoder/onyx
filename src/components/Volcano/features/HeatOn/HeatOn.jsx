import ToggleSwitch from "../../../../features/shared/styledComponents/Switch";
export default function HeatOn(props) {
  return (
    <div className="heat-air-button">
      <ToggleSwitch
        isToggleOn={props.isHeatOn}
        onText="Heat On"
        offText="Heat Off"
        onChange={props.onChange}
      />
    </div>
  );
}
