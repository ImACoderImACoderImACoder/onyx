import { useState, useEffect } from "react";
import SerialNumber from "./SerialNumber";
import { serialNumberUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import BleGattOverhead from "../../../../services/BleGattOverhead";

export default function ReadSerialNumber(props) {
  const [serialNumber, setSerialNumber] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || serialNumber) {
    } else {
      const func = {
        then: (resolve) => {
          BleGattOverhead(props.bleDevice).then(
            (
              bleService,
              primaryServiceUuidVolcano1,
              primaryServiceUuidVolcano2,
              primaryServiceUuidVolcano3
            ) => {
              return primaryServiceUuidVolcano3
                .getCharacteristic(serialNumberUuid)
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
            }
          );
        },
      };

      AddToQueue(func);
    }
  }, [props.bleDevice, serialNumber]);

  return <SerialNumber serialNumber={serialNumber} />;
}
