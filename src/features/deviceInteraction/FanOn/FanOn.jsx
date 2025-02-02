import React, { useEffect, useMemo } from "react";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import ToggleSwitch from "../../shared/styledComponents/Switch";
import { useSelector } from "react-redux";

export default React.forwardRef((props, ref) => {
  const enterKeyCode = 13;
  const startTime = useMemo(() => Date.now(), []);
  const leftButton = useSelector((state) => state.gamepad.squareIsPressed.current);
  const cancelButton = useSelector((state) => state.gamepad.circleIsPressed.current);

  useEffect(() => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    // check to see if half a second has lapsed since mount
    if (timeElapsed >= 500) {
      ref.current.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [leftButton]);


useEffect(() => {
  if (!cancelButton || !props.isFanOn) return;
  ref.current.click();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [cancelButton])

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
