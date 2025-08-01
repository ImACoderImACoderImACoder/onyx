import {
  TEMPERATURE_OVERFLOW_THRESHOLD,
  MIN_CELSIUS_TEMP,
  MAX_CELSIUS_TEMP,
  DEGREE_SYMBOL,
} from "../constants/temperature";
import WorkflowItemTypes from "../constants/enums";

import {
  localStorageKey,
  defaultTemperatureArray,
  defaultGlobalFanOnTimeInSeconds,
  defaultWorkflows,
} from "../constants/constants";

import { aSuperSpecialAutoThemeSettingsId } from "../constants/themeIds";

// Language configuration
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es'];

export function convertToUInt8BLE(val) {
  const buffer = new ArrayBuffer(1);
  const dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  return buffer;
}

export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}

export function convertToUInt16BLE(val) {
  const buffer = new ArrayBuffer(2);
  const dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  dataView.setUint8(1, Math.floor(val / 256));

  return buffer;
}

export function convertToUInt32BLE(val) {
  const buffer = new ArrayBuffer(4);
  const dataView = new DataView(buffer);
  dataView.setUint8(0, val & 255);
  let tempVal = val >> 8;
  dataView.setUint8(1, tempVal & 255);
  tempVal = tempVal >> 8;
  dataView.setUint8(2, tempVal & 255);
  tempVal = tempVal >> 8;
  dataView.setUint8(3, tempVal & 255);

  return buffer;
}

export function convertToggleCharacteristicToBool(value, mask) {
  if ((value & mask) === 0) {
    return false;
  }
  return true;
}

export function convertCurrentTemperatureCharacteristicToCelcius(value) {
  const result = Math.round(convertBLEtoUint16(value) / 10);

  return result < TEMPERATURE_OVERFLOW_THRESHOLD ? result : MIN_CELSIUS_TEMP;
}

export function convertToFahrenheitFromCelsius(celsius) {
  return Math.round(celsius * 1.8 + 32);
}

export function convertToCelsiusFromFahrenheit(fahrenheit) {
  return Math.round((fahrenheit - 32) * (5 / 9));
}

export function getDisplayTemperature(temperature, isF) {
  const temperatureAbbreviation = isF ? "F" : "C";
  const normalizedTemperature = isF
    ? convertToFahrenheitFromCelsius(temperature)
    : temperature;

  return `${normalizedTemperature}${DEGREE_SYMBOL}${temperatureAbbreviation}`;
}

export function isValueInValidVolcanoCelciusRange(value) {
  if (isNaN(value)) {
    return false;
  }

  return !(value > MAX_CELSIUS_TEMP || value < MIN_CELSIUS_TEMP);
}

export function ReadConfigFromLocalStorage() {
  let config = JSON.parse(window.localStorage.getItem(localStorageKey));
  const defaultConfig = {
    temperatureControlValues: defaultTemperatureArray,
    currentTheme: aSuperSpecialAutoThemeSettingsId,
    workflows: {
      items: defaultWorkflows,
      [WorkflowItemTypes.FAN_ON_GLOBAL]: defaultGlobalFanOnTimeInSeconds,
    },
    onConnectTurnHeatOn: false,
    isMinimalistMode: false,
  };
  if (!config) {
    window.localStorage.setItem(localStorageKey, JSON.stringify(defaultConfig));
    config = defaultConfig;
  } else {
    config = { ...defaultConfig, ...config };
    if (!config.workflows.items) {
      config.workflows = {
        items: config.workflows,
        [WorkflowItemTypes.FAN_ON_GLOBAL]: defaultGlobalFanOnTimeInSeconds,
      };
    }
  }

  return config;
}

export function WriteNewConfigToLocalStorage(config) {
  const comparer = function (a, b) {
    return a - b;
  };

  const sortedTemperatureControlValues = [
    ...config.temperatureControlValues,
  ].sort(comparer);

  const sortedTemperatureConfig = {
    ...config,
    temperatureControlValues: sortedTemperatureControlValues,
  };

  window.localStorage.setItem(
    localStorageKey,
    JSON.stringify(sortedTemperatureConfig)
  );
}
