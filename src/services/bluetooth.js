import {
  primaryServiceUuidVolcano1,
  primaryServiceUuidVolcano2,
  primaryServiceUuidVolcano3,
  primaryServiceUuidVolcano4,
  primaryServiceUuidVolcano5,
  heatOffUuid,
} from "../constants/uuids";
import { cacheContainsCharacteristic } from "../services/BleCharacteristicCache";
import { buildCacheFromBleDevice } from "../services/BleCharacteristicCache";

let bluetoothDevice;

const bluetoothConnectFunction = async (onConnected) => {
  if (bluetoothDevice) {
    if (!cacheContainsCharacteristic(heatOffUuid)) {
      onConnected();
      await buildCacheFromBleDevice(bluetoothDevice);
    }
    return bluetoothDevice;
  }

  if (navigator.bluetooth) {
    var pieces = navigator.userAgent.match(
      /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
    );

    if (pieces != null) {
      pieces = pieces.map((piece) => parseInt(piece, 10));

      if (pieces.length > 0 && pieces[0] < 79) {
        alert("Chrome Version kleiner 79, bitte Browser updaten");
      }
    }

    let filters = [];
    let filterNamePrefixVolcano = "S&B";

    filters.push({ namePrefix: filterNamePrefixVolcano });
    let options = {};
    if (
      window.navigator.userAgent.includes("iPhone") ||
      window.navigator.userAgent.includes("Macintosh")
    ) {
      options.filters = filters;
      options.acceptAllDevices = false;
    } else if (
      window.navigator.userAgent.toLowerCase().indexOf("android") > -1
    ) {
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
        bluetoothDevice = device;

        onConnected();

        await buildCacheFromBleDevice(bluetoothDevice);
        return "Adapter resolved. Cache built";
      }
    } catch (error) {
      if (
        error.toString().includes("User cancelled") ||
        error.toString().includes("a user gesture")
      ) {
        bluetoothDevice = undefined;
        return "Ble canceled";
      } else {
        const alertMessage =
          "BLE connection issue, please reset web page and retry!\n" +
          error.toString() +
          "\n" +
          error.stack;
        alert(alertMessage);
        throw new Error(alertMessage);
      }
    }
  } else {
    const bleNotSupported = "WEB BLE not supported";
    alert(bleNotSupported);
    throw new Error(bleNotSupported);
  }
};

export default bluetoothConnectFunction;
