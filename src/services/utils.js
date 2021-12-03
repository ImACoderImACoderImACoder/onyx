import {
  TEMPERATURE_OVERFLOW_THRESHOLD,
  MIN_CELSIUS_TEMP,
  MAX_CELSIUS_TEMP,
  DEGREE_SYMBOL,
} from "../constants/temperature";

export function convertToUInt8BLE(val) {
  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  return buffer;
}

export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}

export function convertToUInt32BLE(val) {
  var buffer = new ArrayBuffer(4);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val & 255);
  var tempVal = val >> 8;
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
  return Math.floor(celsius * 1.8 + 32); //when you sacrifice accuracy for memes
}

export function getDisplayTemperature(temperature, isF) {
  const normalizedTemperature = isF
    ? convertToFahrenheitFromCelsius(temperature)
    : temperature;
  const temperatureAbbreviation = isF ? "F" : "C";

  return `${normalizedTemperature}${DEGREE_SYMBOL}${temperatureAbbreviation}`;
}

export function isValueInValidVolcanoCelciusRange(value) {
  return !(value > MAX_CELSIUS_TEMP || value < MIN_CELSIUS_TEMP);
}
