import BootstrapSwitchButton from "bootstrap-switch-button-react";

export default function VibrationToggle(props) {
  return (
    <div>
      <h2>Vibrate Fan when Volcano reaches temperature </h2>
      <BootstrapSwitchButton
        onlabel="On"
        offlabel="Off"
        checked={props.isVibrationEnabled}
        onstyle="success"
        offstyle="danger"
        // eslint-disable-next-line
        onChange={props.onChange}
      />
    </div>
  );
}
