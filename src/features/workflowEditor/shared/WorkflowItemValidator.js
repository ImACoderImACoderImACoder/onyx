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
      case WorkflowItemTypes.FAN_ON_GLOBAL:
      case WorkflowItemTypes.FAN_ON: {
        const isPayloadValid =
          !isNaN(parsedPayloadInput) && parsedPayloadInput >= 0;
        if (!isPayloadValid) {
          onError("Value must be a number and greater than 0");
        }
        return isPayloadValid;
      }
      case WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS: {
        const normalizedHeatOnValue = isF
          ? convertToCelsiusFromFahrenheit(parsedPayloadInput)
          : parsedPayloadInput;

        const isPayloadValid = isValueInValidVolcanoCelciusRange(
          normalizedHeatOnValue
        );

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
      case WorkflowItemTypes.LOOP_FROM_BEGINNING:
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
      case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS: {
        // For conditional heat, payload is an object, not a simple value
        if (!payload || typeof payload !== 'object') {
          onError("Invalid conditional heat configuration");
          return false;
        }

        // Validate default settings
        if (!payload.default || typeof payload.default !== 'object') {
          onError("Missing default temperature settings");
          return false;
        }

        // Validate default temperature (stored in Celsius in config)
        const defaultTemp = payload.default.temp;
        if (defaultTemp === undefined || defaultTemp === null) {
          onError("Default temperature is required");
          return false;
        }

        // Temperature in config is always in Celsius
        if (!isValueInValidVolcanoCelciusRange(defaultTemp)) {
          const minTemp = isF
            ? convertToFahrenheitFromCelsius(MIN_CELSIUS_TEMP)
            : MIN_CELSIUS_TEMP;
          const maxTemp = isF
            ? convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)
            : MAX_CELSIUS_TEMP;
          const unit = isF ? "°F" : "°C";
          onError(`Default temperature must be between ${minTemp}${unit} and ${maxTemp}${unit}`);
          return false;
        }

        // Validate default wait (optional)
        if (payload.default.wait !== undefined && payload.default.wait !== null) {
          const defaultWait = parseFloat(payload.default.wait);
          if (isNaN(defaultWait) || defaultWait < 0) {
            onError("Default wait must be >= 0");
            return false;
          }
        }

        // Validate conditions array
        if (!Array.isArray(payload.conditions) || payload.conditions.length === 0) {
          onError("At least one condition is required");
          return false;
        }

        // Validate each condition
        for (let i = 0; i < payload.conditions.length; i++) {
          const condition = payload.conditions[i];
          
          if (!condition || typeof condition !== 'object') {
            onError(`Condition ${i + 1} is invalid`);
            return false;
          }

          // Validate ifTemp (stored in Celsius in config)
          if (condition.ifTemp === undefined || condition.ifTemp === null) {
            onError(`Condition ${i + 1}: "If Temp" is required`);
            return false;
          }

          // Temperature in config is always in Celsius
          if (!isValueInValidVolcanoCelciusRange(condition.ifTemp)) {
            const minTemp = isF
              ? convertToFahrenheitFromCelsius(MIN_CELSIUS_TEMP)
              : MIN_CELSIUS_TEMP;
            const maxTemp = isF
              ? convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)
              : MAX_CELSIUS_TEMP;
            const unit = isF ? "°F" : "°C";
            onError(`Condition ${i + 1}: "If Temp" must be between ${minTemp}${unit} and ${maxTemp}${unit}`);
            return false;
          }

          // Validate nextTemp (stored in Celsius in config)
          if (condition.nextTemp === undefined || condition.nextTemp === null) {
            onError(`Condition ${i + 1}: "Next Temp" is required`);
            return false;
          }

          // Temperature in config is always in Celsius
          if (!isValueInValidVolcanoCelciusRange(condition.nextTemp)) {
            const minTemp = isF
              ? convertToFahrenheitFromCelsius(MIN_CELSIUS_TEMP)
              : MIN_CELSIUS_TEMP;
            const maxTemp = isF
              ? convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)
              : MAX_CELSIUS_TEMP;
            const unit = isF ? "°F" : "°C";
            onError(`Condition ${i + 1}: "Next Temp" must be between ${minTemp}${unit} and ${maxTemp}${unit}`);
            return false;
          }

          // Validate wait (optional)
          if (condition.wait !== undefined && condition.wait !== null) {
            const wait = parseFloat(condition.wait);
            if (isNaN(wait) || wait < 0) {
              onError(`Condition ${i + 1}: Wait must be >= 0`);
              return false;
            }
          }
        }

        return true;
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
