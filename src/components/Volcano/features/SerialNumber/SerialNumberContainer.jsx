import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
} from "../../../../constants/uuids";
import SerialNumber from "./SerialNumber";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function ReadSerialNumber(props) {
  const [serialNumber, setSerialNumber] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || serialNumber) {
    } else {
      const func = {
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
              // Get all characteristics.
              return primaryServiceUuidVolcano3.getCharacteristic(
                "10100008-5354-4f52-5a26-4249434b454c"
              );
            })
            .then((characteristic) => {
              return characteristic.readValue();
            })
            .then((value) => {
              let decoder = new TextDecoder("utf-8");
              let serialNumber = decoder.decode(value);
              const normalizedSerialNumber = serialNumber.substring(0, 8);
              setSerialNumber(normalizedSerialNumber);
              resolve(normalizedSerialNumber);
            });
        },
      };

      AddToQueue(func);
    }
  }, [props.bleDevice, serialNumber]);

  return <SerialNumber serialNumber={serialNumber} />;
}
