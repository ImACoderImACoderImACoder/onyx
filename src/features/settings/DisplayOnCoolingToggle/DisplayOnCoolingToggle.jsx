import BootstrapSwitchButton from "bootstrap-switch-button-react";

export default function DisplayOnCoolingToggle(props) {
  return (
    <div>
      <h2>Volcano shows temperature when the heat is turned off</h2>
      <BootstrapSwitchButton
        onlabel="On"
        offlabel="Off"
        checked={props.isDisplayOnCooling}
        onstyle="success"
        offstyle="danger"
        onChange={props.onChange}
      />
    </div>
  );
}
