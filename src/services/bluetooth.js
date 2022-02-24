import {
  primaryServiceUuidVolcano1,
  primaryServiceUuidVolcano2,
  primaryServiceUuidVolcano3,
  primaryServiceUuidVolcano4,
  primaryServiceUuidVolcano5,
} from "../constants/uuids";
import { buildCacheFromBleDevice } from "../services/BleCharacteristicCache";

const bluetoothConnectFunction = async (onConnected, onDisconnected) => {
  const iSiOSdevice =
    window.navigator.userAgent.includes("iPhone") ||
    window.navigator.userAgent.includes("Macintosh") ||
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
    }
  } catch (error) {
    const errorMessage = error.toString();
    if (
      errorMessage.includes("User cancelled") ||
      errorMessage.includes("a user gesture") ||
      !errorMessage
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
