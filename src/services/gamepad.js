import { useState, useEffect } from "react";
import WorkflowItemTypes from "../constants/enums";

// PlayStation/Xbox/Nintendo
const buttonIdxMapping = new Map([
  [WorkflowItemTypes.HEAT_ON, 0], // Cross/A/B
  [WorkflowItemTypes.FAN_ON, 2], // Square/X/Y
  [WorkflowItemTypes.TEMP_UP, 12], // Up on D-Pad
  [WorkflowItemTypes.TEMP_DOWN, 13], // Down on D-Pad
  [WorkflowItemTypes.TEMP_MIN, 4], // R1/RB/R
  [WorkflowItemTypes.TEMP_MAX, 5], // L1/LB/L
])

export default function useGamepad(wfItemType) {
  const [gamepad, setGamepad] = useState(null);
  const buttonIdx = buttonIdxMapping.get(wfItemType);

  useEffect(() => {
    const handleGamepadInput = () => {
      const pads = navigator.getGamepads().filter(p => p !== null);
      setGamepad(pads[pads.length - 1]); // Use the last connected gamepad
    };

    const intervalId = setInterval(handleGamepadInput, 100); // Poll every 100ms
    return () => clearInterval(intervalId);
  }, []);

  const isButtonPressed = gamepad?.buttons[buttonIdx]?.pressed;
  return isButtonPressed;
}