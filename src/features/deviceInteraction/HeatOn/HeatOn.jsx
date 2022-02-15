import { useRef } from "react";
import ToggleSwitch from "../../../features/shared/styledComponents/Switch";
export default function HeatOn(props) {
  const ref = useRef(null);
  const enterKeyCode = 13;
  const handler = (e) => {
    if (e.keyCode === enterKeyCode) {
      ref.current.click();
    }
  };

  return (
    <div
      aria-label={`Toggle heat button, currently heat is ${
        props.isHeatOn ? "on" : "off"
      }`}
      tabIndex={0}
      onKeyUp={handler}
      className="heat-air-button"
    >
      <ToggleSwitch
        isToggleOn={props.isHeatOn}
        onText="Heat On"
        offText="Heat Off"
        ref={ref}
        onChange={props.onChange}
      />
    </div>
  );
}
