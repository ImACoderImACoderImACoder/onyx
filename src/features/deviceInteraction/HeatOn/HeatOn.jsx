import { useRef, useEffect, useMemo } from "react";
import ToggleSwitch from "../../../features/shared/styledComponents/Switch";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import { useSelector } from "react-redux";

export default function HeatOn(props) {
  const ref = useRef(null);
  const enterKeyCode = 13;
  const startTime = useMemo(() => Date.now(), []);
  const bottomButton = useSelector((state) => state.gamepad.crossIsPressed.current);
  const cancelButton = useSelector((state) => state.gamepad.circleIsPressed.current);

  useEffect(() => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;
    // check to see if half a second has lapsed since mount
    if (timeElapsed >= 500) {
      ref.current.click();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [bottomButton]);

useEffect(() => {
  if (!cancelButton || !props.isHeatOn) return;
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
        offText={<PrideTextWithDiv text="Heat Off" />}
        ref={ref}
        onChange={props.onChange}
      />
    </div>
  );
}
