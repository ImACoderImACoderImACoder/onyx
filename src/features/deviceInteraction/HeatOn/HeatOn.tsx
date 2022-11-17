import { KeyboardEventHandler, useRef } from "react";
import ToggleSwitch from "../../shared/styledComponents/Switch";
import { PrideTextWithDiv } from "../../../themes/PrideText";

interface HeatOnProps {
  isHeatOn: boolean;
  onChange: (nextState: boolean) => void;
}

export default function HeatOn({ isHeatOn, onChange }: HeatOnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enterKeyCode = 13;
  const handler: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.keyCode === enterKeyCode && ref.current) {
      ref.current.click();
    }
  };

  return (
    <div
      aria-label={`Toggle heat button, currently heat is ${
        isHeatOn ? "on" : "off"
      }`}
      tabIndex={0}
      onKeyUp={handler}
      className="heat-air-button"
    >
      <ToggleSwitch
        isToggleOn={isHeatOn}
        onText="Heat On"
        offText={<PrideTextWithDiv text="Heat Off" />}
        ref={ref}
        onChange={onChange}
      />
    </div>
  );
}
