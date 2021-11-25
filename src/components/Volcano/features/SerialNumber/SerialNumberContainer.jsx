import { useState, useEffect } from "react";
import SerialNumber from "./SerialNumber";
import { serialNumberUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";

export default function ReadSerialNumber(props) {
  const [serialNumber, setSerialNumber] = useState(undefined);
  useEffect(() => {
    const blePayload = {
      then: (resolve) => {
        const characteristic = getCharacteristic(serialNumberUuid);
        characteristic.readValue().then((value) => {
          let decoder = new TextDecoder("utf-8");
          let serialNumber = decoder.decode(value);
          const normalizedSerialNumber = serialNumber.substring(0, 8);
          setSerialNumber(normalizedSerialNumber);
          resolve(normalizedSerialNumber);
        });
      },
    };

    AddToQueue(blePayload);
  }, []);

  return <SerialNumber serialNumber={serialNumber} />;
}
