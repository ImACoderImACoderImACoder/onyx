import { GamepadButtons } from "../constants/enums";
import { useDispatch } from "react-redux";
import { setCrossIsPressed,
  setSquareIsPressed,
  setCircleIsPressed,
  setR1IsPressed,
  setL1IsPressed,
  setUpIsPressed,
  setDownIsPressed } from "../features/deviceInteraction/gamepadSlice";
import store from '../store';

const buttonsToCheck = [
  {
    buttonIdx: GamepadButtons.CROSS_A,
    dispatcher: setCrossIsPressed,
    toggle: true,
  },
  {
    buttonIdx: GamepadButtons.SQUARE_X,
    dispatcher: setSquareIsPressed,
    toggle: true,
  },
  {
    buttonIdx: GamepadButtons.CIRCLE_B,
    dispatcher: setCircleIsPressed,
  },
  {
    buttonIdx: GamepadButtons.R1_RB,
    dispatcher: setR1IsPressed,
  },
  {
    buttonIdx: GamepadButtons.L1_LB,
    dispatcher: setL1IsPressed,
  },
  {
    buttonIdx: GamepadButtons.UP_DPAD,
    dispatcher: setUpIsPressed,
  },
  {
    buttonIdx: GamepadButtons.DOWN_DPAD,
    dispatcher: setDownIsPressed,
  },
]

export default function useGamepad() {
  const dispatch = useDispatch();

  const handleGamepadInput = () => {
    const pads = navigator.getGamepads().filter(p => p !== null);
    if (!pads.length) return;
    const storePad = store.getState().gamepad;
    buttonsToCheck.forEach(({buttonIdx, dispatcher, toggle}) => {
      let storeValue = false;
      const gamepadValue = pads.some((p) => p.buttons[buttonIdx].pressed);
      switch (buttonIdx) {
        case GamepadButtons.CROSS_A:
          storeValue = storePad.crossIsPressed;
          break;
        case GamepadButtons.SQUARE_X:
          storeValue = storePad.squareIsPressed;
          break;
        case GamepadButtons.CIRCLE_B:
            storeValue = storePad.circleIsPressed;
            break;
        case GamepadButtons.R1_RB:
          storeValue = storePad.r1IsPressed;
          break;
        case GamepadButtons.L1_LB:
          storeValue = storePad.l1IsPressed;
          break;
        case GamepadButtons.UP_DPAD:
          storeValue = storePad.upIsPressed;
          break;
        case GamepadButtons.DOWN_DPAD:
          storeValue = storePad.downIsPressed;
          break;
        default: 
          storeValue = false;
          break;
      }
      if (storeValue.previous !== gamepadValue) {
        if (toggle) {
          dispatch(dispatcher({previous: gamepadValue, current: !storeValue.previous ? !storeValue.current : storeValue.current}));
        } else {
          dispatch(dispatcher({previous: gamepadValue, current: gamepadValue}));
        }
      } else {
        dispatch(dispatcher({...storeValue, previous: gamepadValue}));
      }
    })
  };

  const intervalId = setInterval(handleGamepadInput, 50); // Poll every 50ms
  
  return () => clearInterval(intervalId);
}