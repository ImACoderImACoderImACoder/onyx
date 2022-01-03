import * as uuIds from "../constants/uuids";
let cache = {};

export function cacheContainsCharacteristic(characteristicId) {
  const characteristic = cache[characteristicId];
  if (characteristic) {
    return true;
  }
  return false;
}

export function clearCache() {
  cache = {};
  console.log("Cache Cleared!");
}

export function getCharacteristic(characteristicId) {
  const characteristic = cache[characteristicId];
  if (!characteristic) {
    throw new Error("Characteristic not found in cache");
  }
  return characteristic;
}

function writeCharacteristicToCache(characteristic, characteristicId) {
  cache[characteristicId] = characteristic;
}

export async function buildCacheFromBleDevice(bleDevice, gattRetryCount = 0) {
  try {
    clearCache();
    writeCharacteristicToCache(bleDevice, uuIds.bleDeviceUuid);

    let bleServer = await bleDevice.gatt.connect();
    writeCharacteristicToCache(bleServer, uuIds.bleServerUuid);
    const primaryServiceUuidVolcano1 = await bleServer.getPrimaryService(
      uuIds.primaryServiceUuidVolcano1
    );

    writeCharacteristicToCache(
      primaryServiceUuidVolcano1,
      uuIds.primaryServiceUuidVolcano1
    );

    const primaryServiceUuidVolcano2 = await bleServer.getPrimaryService(
      uuIds.primaryServiceUuidVolcano2
    );
    writeCharacteristicToCache(
      primaryServiceUuidVolcano2,
      uuIds.primaryServiceUuidVolcano2
    );

    const primaryServiceUuidVolcano3 = await bleServer.getPrimaryService(
      uuIds.primaryServiceUuidVolcano3
    );
    writeCharacteristicToCache(
      primaryServiceUuidVolcano3,
      uuIds.primaryServiceUuidVolcano3
    );

    const primaryServiceUuidVolcano4 = await bleServer.getPrimaryService(
      uuIds.primaryServiceUuidVolcano4
    );
    writeCharacteristicToCache(
      primaryServiceUuidVolcano4,
      uuIds.primaryServiceUuidVolcano4
    );

    const heatOffCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(uuIds.heatOffUuid);
    writeCharacteristicToCache(heatOffCharacteristic, uuIds.heatOffUuid);

    const heatOnCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(uuIds.heatOnUuid);
    writeCharacteristicToCache(heatOnCharacteristic, uuIds.heatOnUuid);

    const fanOffCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(uuIds.fanOffUuid);
    writeCharacteristicToCache(fanOffCharacteristic, uuIds.fanOffUuid);

    const fanOnCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(uuIds.fanOnUuid);
    writeCharacteristicToCache(fanOnCharacteristic, uuIds.fanOnUuid);

    const hoursOfOperationCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(
        uuIds.hoursOfOperationUuid
      );
    writeCharacteristicToCache(
      hoursOfOperationCharacteristic,
      uuIds.hoursOfOperationUuid
    );

    const bleFirmwareVersionCharacteristic =
      await primaryServiceUuidVolcano3.getCharacteristic(
        uuIds.bleFirmwareVersionUuid
      );
    writeCharacteristicToCache(
      bleFirmwareVersionCharacteristic,
      uuIds.bleFirmwareVersionUuid
    );

    const register2Characteristic =
      await primaryServiceUuidVolcano3.getCharacteristic(uuIds.register2Uuid);
    writeCharacteristicToCache(register2Characteristic, uuIds.register2Uuid);

    const register1Characteristic =
      await primaryServiceUuidVolcano3.getCharacteristic(uuIds.register1Uuid);
    writeCharacteristicToCache(register1Characteristic, uuIds.register1Uuid);

    const serialNumberCharacteristic =
      await primaryServiceUuidVolcano3.getCharacteristic(
        uuIds.serialNumberUuid
      );
    writeCharacteristicToCache(
      serialNumberCharacteristic,
      uuIds.serialNumberUuid
    );

    const volcanoFirmwareVersionCharacteristic =
      await primaryServiceUuidVolcano3.getCharacteristic(
        uuIds.volcanoFirmwareVersionUuid
      );
    writeCharacteristicToCache(
      volcanoFirmwareVersionCharacteristic,
      uuIds.volcanoFirmwareVersionUuid
    );

    const currentTemperatureCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(
        uuIds.currentTemperatureUuid
      );
    writeCharacteristicToCache(
      currentTemperatureCharacteristic,
      uuIds.currentTemperatureUuid
    );

    const writeTemperatureCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(
        uuIds.writeTemperatureUuid
      );
    writeCharacteristicToCache(
      writeTemperatureCharacteristic,
      uuIds.writeTemperatureUuid
    );

    const autoOffCharacteristic =
      await primaryServiceUuidVolcano4.getCharacteristic(uuIds.autoShutoffUuid);

    writeCharacteristicToCache(autoOffCharacteristic, uuIds.autoShutoffUuid);

    const register3 = await primaryServiceUuidVolcano3.getCharacteristic(
      uuIds.register3Uuid
    );
    writeCharacteristicToCache(register3, uuIds.register3Uuid);

    return "Cache Built!";
  } catch (error) {
    console.warn(error);
    console.warn(
      `Error while building BLE caching on attempt #${
        gattRetryCount + 1
      }... Trying to establish cache again`
    );
    if (gattRetryCount < 3) {
      await bleDevice.gatt.disconnect();
      await buildCacheFromBleDevice(bleDevice, gattRetryCount + 1);
    } else {
      throw new Error(
        `Could not establish Ble connection after ${
          gattRetryCount + 1
        } attemps.  Refresh your browser and try again`
      );
    }
  }
}
