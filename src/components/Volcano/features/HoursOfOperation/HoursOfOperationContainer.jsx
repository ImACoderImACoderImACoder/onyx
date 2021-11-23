import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
} from "../../../../constants/uuids";

import { convertBLEtoUint16 } from "../../../../services/utils";

import HoursOfOperation from "./HoursOfOperation";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function HoursOfOperationContainer(props) {
  const [hoursOfOperation, setHoursOfOperation] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || hoursOfOperation) {
    } else {
      const func = {
        then: (resolve) => {
          let primaryServiceUuidVolcano4;
          let bleServer;
          props.bleDevice.gatt
            .connect()
            .then((server) => {
              bleServer = server;
              return bleServer.getPrimaryService(serviceUuidVolcano1);
            })
            .then((service) => {
              return bleServer.getPrimaryService(serviceUuidVolcano2);
            })
            .then((service) => {
              return bleServer.getPrimaryService(serviceUuidVolcano3);
            })
            .then((service) => {
              return bleServer.getPrimaryService(serviceUuidVolcano4);
            })
            .then((service) => {
              primaryServiceUuidVolcano4 = service;
            })
            // Read Hours of Operation
            .then((service) => {
              // Get all characteristics.
              return primaryServiceUuidVolcano4.getCharacteristic(
                "10110015-5354-4f52-5a26-4249434b454c"
              );
            })
            .then((characteristic) => {
              return characteristic.readValue();
            })

            .then((value) => {
              const useHoursVolcano = (
                convertBLEtoUint16(value) / 10
              ).toString();
              setHoursOfOperation(useHoursVolcano);
              resolve(useHoursVolcano);
            });
        },
      };
      AddToQueue(func);
    }
  }, [props.bleDevice, hoursOfOperation]);

  return <HoursOfOperation hoursOfOperation={hoursOfOperation} />;
}
