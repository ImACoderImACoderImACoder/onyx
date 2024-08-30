import { useRef, useEffect } from "react";
import ToggleSwitch from "../../../features/shared/styledComponents/Switch";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import useGamepad from '../../../services/gamepad';
import WorkflowItemTypes from '../../../constants/enums';

export default function HeatOn(props) {
  const ref = useRef(null);
  const enterKeyCode = 13;
  const buttonIsPressed = useGamepad(WorkflowItemTypes.HEAT_ON);

  useEffect(() => {
    if (buttonIsPressed) {
      ref.current.click();
    }
  }, [buttonIsPressed, ref]);

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
