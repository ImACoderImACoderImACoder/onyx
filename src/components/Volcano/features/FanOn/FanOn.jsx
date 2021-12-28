import BootstrapSwitchButton from "bootstrap-switch-button-react";

export default function FanOn(props) {
  return (
    <div onClick={props.onChange} className="heat-air-button">
      <BootstrapSwitchButton
        onlabel={"Fan On"}
        offlabel="Fan Off"
        checked={props.isFanOn}
        onstyle="success"
        offstyle="danger"
        // eslint-disable-next-line
        style="heat-air-button"
        disabled={true}
      />
    </div>
  );
}
