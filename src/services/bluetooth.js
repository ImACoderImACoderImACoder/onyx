import {
  primaryServiceUuidVolcano1,
  primaryServiceUuidVolcano2,
  primaryServiceUuidVolcano3,
  primaryServiceUuidVolcano4,
  primaryServiceUuidVolcano5,
  heatOnUuid,
} from "../constants/uuids";
import {
  buildCacheFromBleDevice,
  getCharacteristic,
} from "../services/BleCharacteristicCache";
import { ReadConfigFromLocalStorage, convertToUInt8BLE } from "./utils";

const bluetoothConnectFunction = async (onConnected, onDisconnected) => {
  const iSiOSdevice =
    window.navigator.userAgent.includes("iPhone") ||
    window.navigator.userAgent.includes("WebBLE") ||
    window.navigator.userAgent.includes("iPad");

  if (!navigator.bluetooth) {
    const bleNotSupported = `WEB BLE not supported. ${
      iSiOSdevice
        ? 'Download "WebBLE" or "Bluefy" from the app store to use Project Onyx on this device.'
        : ""
    }`;
    alert(bleNotSupported);
    throw new Error(bleNotSupported);
  }

  const filters = [];
  const options = {};
  const filterNamePrefixVolcano = "S&B";

  filters.push({ namePrefix: filterNamePrefixVolcano });
  if (iSiOSdevice) {
    options.filters = filters;
    options.acceptAllDevices = false;
  } else {
    filters.push({
      services: [
        primaryServiceUuidVolcano1,
        primaryServiceUuidVolcano2,
        primaryServiceUuidVolcano3,
        primaryServiceUuidVolcano4,
        primaryServiceUuidVolcano5,
      ],
    });
    options.filters = filters;
    options.acceptAllDevices = false;
  }
  try {
    const device = await navigator.bluetooth.requestDevice(options);
    if (device.name.includes("S&B VOLCANO")) {
      onConnected();
      await device.addEventListener("gattserverdisconnected", onDisconnected);
      await buildCacheFromBleDevice(device);
      const config = ReadConfigFromLocalStorage();
      if (config.onConnectTurnHeatOn) {
        const characteristic = getCharacteristic(heatOnUuid);
        const buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
      }
    }
  } catch (error) {
    const errorMessage = error.toString();
    if (
      errorMessage.includes("User cancelled") ||
      errorMessage.includes("a user gesture") ||
      errorMessage === "2" //The things you do for 3rd party support
    ) {
      return;
    }
    const alertMessage =
      "Bluetooth connection error.  Please refresh the page and try again.\n" +
      errorMessage +
      "\n" +
      error.stack;
    alert(alertMessage);
    throw new Error(alertMessage);
  }
};

export default bluetoothConnectFunction;
