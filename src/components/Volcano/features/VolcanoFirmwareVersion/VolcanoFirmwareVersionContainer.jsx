import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
} from "../../../../constants/uuids";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function VolcanoFirmwareVersionContainer(props) {
  const [volcanoFirmwareVersion, setVolcanoFirmwareVersion] =
    useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || volcanoFirmwareVersion) {
    } else {
      const blePayload = {
        then: (resolve) => {
          let primaryServiceUuidVolcano3;
          let bleServer;
          props.bleDevice.gatt
            .connect()
            .then((server) => {
              bleServer = server;
              return bleServer.getPrimaryService(serviceUuidVolcano1);
            })
            //confirmed required for some reason
            .then((service) => {
              return bleServer.getPrimaryService(serviceUuidVolcano3);
            })
            //these thens do matter and I need primary service uuid volcano 3 to read the temp.
            .then((service) => {
              primaryServiceUuidVolcano3 = service;
              return bleServer.getPrimaryService(serviceUuidVolcano4);
            })
            // Read Firmware Version
            .then((service) => {
              // Get all characteristics.
              return primaryServiceUuidVolcano3.getCharacteristic(
                "10100003-5354-4f52-5a26-4249434b454c"
              );
            })
            .then((characteristic) => {
              return characteristic.readValue();
            })

            .then((value) => {
              let decoder = new TextDecoder("utf-8");
              let firmwareV = decoder.decode(value);
              const normalizedFirmwareVersion = firmwareV.substring(0, 8);
              setVolcanoFirmwareVersion(normalizedFirmwareVersion);
              resolve(normalizedFirmwareVersion);
            });
        },
      };
      AddToQueue(blePayload);
    }
  }, [props.bleDevice, volcanoFirmwareVersion]);

  return (
    <VolcanoFirmwareVersion volcanoFirmwareVersion={volcanoFirmwareVersion} />
  );
}
