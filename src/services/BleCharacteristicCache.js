import * as uuIds from "../constants/uuids";
let cache = {};

export function clearCache() {
  cache = {};
}
export function cacheContainsCharacteristic(characteristicId) {
  const characteristic = cache[characteristicId];
  if (characteristic) {
    return true;
  }
  return false;
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

export function buildCacheFromBleDevice(bleDevice) {
  return {
    then: (resolve) => {
      bleDevice.gatt
        .connect()
        .then((server) => {
          writeCharacteristicToCache(server, uuIds.bleServer);
          return server.getPrimaryService(uuIds.primaryServiceUuidVolcano1);
        })
        .then((service) => {
          writeCharacteristicToCache(service, uuIds.primaryServiceUuidVolcano1);
          const bleServer = getCharacteristic(uuIds.bleServer);
          return bleServer.getPrimaryService(uuIds.primaryServiceUuidVolcano2);
        })
        .then((service) => {
          writeCharacteristicToCache(service, uuIds.primaryServiceUuidVolcano2);
          const bleServer = getCharacteristic(uuIds.bleServer);
          return bleServer.getPrimaryService(uuIds.primaryServiceUuidVolcano3);
        })
        .then((service) => {
          writeCharacteristicToCache(service, uuIds.primaryServiceUuidVolcano3);
          const bleServer = getCharacteristic(uuIds.bleServer);
          return bleServer.getPrimaryService(uuIds.primaryServiceUuidVolcano4);
        })
        .then((service) => {
          writeCharacteristicToCache(service, uuIds.primaryServiceUuidVolcano4);
          return service.getCharacteristic(uuIds.heatOffUuid);
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.heatOffUuid);
          const primaryServiceUuidVolcano4 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano4
          );
          return primaryServiceUuidVolcano4.getCharacteristic(uuIds.heatOnUuid);
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.heatOnUuid);
          const primaryServiceUuidVolcano4 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano4
          );
          return primaryServiceUuidVolcano4.getCharacteristic(uuIds.fanOffUuid);
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.fanOffUuid);
          const primaryServiceUuidVolcano4 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano4
          );
          return primaryServiceUuidVolcano4.getCharacteristic(uuIds.fanOnUuid);
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.fanOnUuid);
          const primaryServiceUuidVolcano3 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano3
          );
          return primaryServiceUuidVolcano3.getCharacteristic(
            uuIds.bleFirmwareVersionUuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(
            characteristic,
            uuIds.bleFirmwareVersionUuid
          );
          const primaryServiceUuidVolcano3 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano3
          );
          return primaryServiceUuidVolcano3.getCharacteristic(
            uuIds.register2Uuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.register2Uuid);
          const primaryServiceUuidVolcano3 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano3
          );
          return primaryServiceUuidVolcano3.getCharacteristic(
            uuIds.register1Uuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.register1Uuid);
          const primaryServiceUuidVolcano3 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano3
          );
          return primaryServiceUuidVolcano3.getCharacteristic(
            uuIds.serialNumberUuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(characteristic, uuIds.serialNumberUuid);
          const primaryServiceUuidVolcano4 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano4
          );
          return primaryServiceUuidVolcano4.getCharacteristic(
            uuIds.hoursOfOperationUuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(
            characteristic,
            uuIds.hoursOfOperationUuid
          );
          const primaryServiceUuidVolcano3 = getCharacteristic(
            uuIds.primaryServiceUuidVolcano3
          );
          return primaryServiceUuidVolcano3.getCharacteristic(
            uuIds.volcanoFirmwareVersionUuid
          );
        })
        .then((characteristic) => {
          writeCharacteristicToCache(
            characteristic,
            uuIds.volcanoFirmwareVersionUuid
          );
          resolve("cache built");
        });
    },
  };
}
