import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
} from "../../../../constants/uuids";
import BleFirmwareVersion from "./BleFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function VolcanoFirmwareVersionContainer(props) {
  const [bleFirmwareVersion, setBleFirmwareVersion] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || bleFirmwareVersion) {
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
            .then((service) => {
              return primaryServiceUuidVolcano3.getCharacteristic(
                "10100004-5354-4f52-5a26-4249434b454c"
              );
            })
            .then((characteristic) => {
              return characteristic.readValue();
            })

            .then((value) => {
              let decoder = new TextDecoder("utf-8");
              let firmwareBLEVersion = decoder.decode(value);
              setBleFirmwareVersion(firmwareBLEVersion);
              resolve(firmwareBLEVersion);
            });
        },
      };
      AddToQueue(blePayload);
    }
  }, [props.bleDevice, bleFirmwareVersion]);

  return <BleFirmwareVersion bleFirmwareVersion={bleFirmwareVersion} />;
}