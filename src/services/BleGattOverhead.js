import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
} from "../constants/uuids";

let primaryServiceUuidVolcano1;
let primaryServiceUuidVolcano2;
let primaryServiceUuidVolcano3;
let primaryServiceUuidVolcano4;
let bleServer;

export default function BleGattOverhead(bleDevice) {
  if (primaryServiceUuidVolcano1) {
    console.log("resloving bleGattOverhead Via cache");
    return {
      then: (resolve) => {
        resolve(
          bleServer,
          primaryServiceUuidVolcano1,
          primaryServiceUuidVolcano2,
          primaryServiceUuidVolcano3,
          primaryServiceUuidVolcano4
        );
      },
    };
  }
  return {
    then: (resolve) => {
      bleDevice.gatt
        .connect()
        .then((server) => {
          bleServer = server;
          return bleServer.getPrimaryService(serviceUuidVolcano1);
        })
        .then((service) => {
          primaryServiceUuidVolcano1 = service;
          return bleServer.getPrimaryService(serviceUuidVolcano2);
        })
        .then((service) => {
          primaryServiceUuidVolcano2 = service;
          return bleServer.getPrimaryService(serviceUuidVolcano3);
        })
        .then((service) => {
          primaryServiceUuidVolcano3 = service;
          return bleServer.getPrimaryService(serviceUuidVolcano4);
        })
        .then((service) => {
          primaryServiceUuidVolcano4 = service;
          resolve(
            bleServer,
            primaryServiceUuidVolcano1,
            primaryServiceUuidVolcano2,
            primaryServiceUuidVolcano3,
            primaryServiceUuidVolcano4
          );
        });
    },
  };
}
