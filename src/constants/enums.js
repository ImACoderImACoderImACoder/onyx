export const WorkflowItemTypes = Object.freeze({
  HEAT_ON: "heatOn",
  SET_LED_BRIGHTNESS: "setLEDbrightness",
  WAIT: "wait",
  HEAT_OFF: "heatOff",
  FAN_ON: "fanOn",
  FAN_ON_GLOBAL: "fanOnGlobal",
  TEMP_UP: "tempUp",
  TEMP_DOWN: "tempDown",
  TEMP_MIN: "tempMin", // lower temp in config
  TEMP_MAX: "tempMax", // upper temp in config
  ALL_OFF: "allOff", // turns off fan and heat
});

export const GamepadButtons = Object.freeze({
  CROSS_A: 0,
  CIRCLE_B: 1,
  SQUARE_X: 2,
  UP_DPAD: 12,
  DOWN_DPAD: 13,
  L1_LB: 4,
  R1_RB: 5
});