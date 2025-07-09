const WorkflowItemTypes = Object.freeze({
  HEAT_ON: "heatOn",
  SET_LED_BRIGHTNESS: "setLEDbrightness",
  WAIT: "wait",
  HEAT_OFF: "heatOff",
  FAN_ON: "fanOn",
  FAN_ON_GLOBAL: "fanOnGlobal",
  HEAT_ON_WITH_CONDITIONS: "heatOnWithConditions",
  LOOP_UNTIL_TARGET_TEMPERATURE: "loopUntilTargetTemperature",
});

export default WorkflowItemTypes;
