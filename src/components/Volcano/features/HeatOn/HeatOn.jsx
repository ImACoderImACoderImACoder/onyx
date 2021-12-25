import BootstrapSwitchButton from "bootstrap-switch-button-react";

export default function HeatOn(props) {
  return (
    <div className="heat-air-button">
      <BootstrapSwitchButton
        onlabel="Heat On"
        offlabel="Heat Off"
        checked={props.isHeatOn}
        onstyle="success"
        offstyle="danger"
        // eslint-disable-next-line
        style="heat-air-button"
        onChange={props.onChange}
      />
    </div>
  );
}
