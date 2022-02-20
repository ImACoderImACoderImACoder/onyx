import WorkflowItemTypes from "../../../constants/enums";
import {
  convertToCelsiusFromFahrenheit,
  isValueInValidVolcanoCelciusRange,
  convertToFahrenheitFromCelsius,
} from "../../../services/utils";
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../constants/temperature";

const workflowItemValidor = ({ payload, type }, isF, onError = () => {}) => {
  try {
    const parsedPayloadInput = parseFloat(payload);
    switch (type) {
      case WorkflowItemTypes.WAIT: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) && parsedPayloadInput >= 0;
        if (!isPayloadValid) {
          onError("Value must be greater than or eqaul to 0");
        }
        return isPayloadValid;
      }
      case WorkflowItemTypes.FAN_ON: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) && parsedPayloadInput > 0;
        if (!isPayloadValid) {
          onError("Value must be a number and greater than 0");
        }
        return isPayloadValid;
      }
      case WorkflowItemTypes.HEAT_ON: {
        const normalizedHeatOnValue = isF
          ? convertToCelsiusFromFahrenheit(parsedPayloadInput)
          : parsedPayloadInput;

        const isPayloadValid =
          (isValueInValidVolcanoCelciusRange(normalizedHeatOnValue) &&
            !isNaN(parsedPayloadInput)) ||
          payload === "" ||
          payload === null;

        const minTemperature = isF
          ? convertToFahrenheitFromCelsius(MIN_CELSIUS_TEMP)
          : MIN_CELSIUS_TEMP;
        const MaxTemperature = isF
          ? convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)
          : MAX_CELSIUS_TEMP;

        if (!isPayloadValid) {
          onError(
            `Temperature must be between ${minTemperature} and ${MaxTemperature}`
          );
        }

        return isPayloadValid;
      }
      case WorkflowItemTypes.HEAT_OFF: {
        return true;
      }
      case WorkflowItemTypes.SET_LED_BRIGHTNESS: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) &&
          parsedPayloadInput >= 0 &&
          parsedPayloadInput <= 100;

        if (!isPayloadValid) {
          onError("Value must be 0-100");
        }
        return isPayloadValid;
      }
      default: {
        return false;
      }
    }
  } catch {
    console.log("extra incorrect workflow item detected");
    return false;
  }
};

export default workflowItemValidor;
