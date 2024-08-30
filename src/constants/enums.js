const WorkflowItemTypes = Object.freeze({
  HEAT_ON: "heatOn",
  SET_LED_BRIGHTNESS: "setLEDbrightness",
  WAIT: "wait",
  HEAT_OFF: "heatOff",
  FAN_ON: "fanOn",
  FAN_ON_GLOBAL: "fanOnGlobal",
  TEMP_UP: "tempUp",
  TEMP_DOWN: "tempDown",
  TEMP_MIN: "tempMin", // lower temp in config
  TEMP_MAX: "tempMax" // upper temp in config
});

export default WorkflowItemTypes;
