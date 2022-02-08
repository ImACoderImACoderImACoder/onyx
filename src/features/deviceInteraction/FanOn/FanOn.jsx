import React from "react";
import ToggleSwitch from "../../shared/styledComponents/Switch";
export default React.forwardRef((props, ref) => {
  return (
    <div className="heat-air-button">
      <ToggleSwitch
        isToggleOn={props.isFanOn}
        onText="Fan On"
        offText="Fan Off"
        onChange={props.onChange}
        ref={ref}
      />
    </div>
  );
});
