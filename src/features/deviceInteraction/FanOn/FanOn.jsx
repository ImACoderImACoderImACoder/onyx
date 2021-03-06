import React from "react";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import ToggleSwitch from "../../shared/styledComponents/Switch";
export default React.forwardRef((props, ref) => {
  const enterKeyCode = 13;
  const handler = (e) => {
    if (e.keyCode === enterKeyCode) {
      ref.current.click();
    }
  };

  return (
    <div
      aria-label={`Toggle fan button, currently fan is ${
        props.isFanOn ? "on" : "off"
      }`}
      tabIndex={0}
      onKeyUp={handler}
      className="heat-air-button"
    >
      <ToggleSwitch
        isToggleOn={props.isFanOn}
        onText="Fan On"
        offText={<PrideTextWithDiv text="Fan Off" />}
        onChange={props.onChange}
        ref={ref}
      />
    </div>
  );
});
