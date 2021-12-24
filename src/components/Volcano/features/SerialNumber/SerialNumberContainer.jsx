import { useState, useEffect } from "react";
import SerialNumber from "./SerialNumber";
import { serialNumberUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";

export default function ReadSerialNumber(props) {
  const [serialNumber, setSerialNumber] = useState(undefined);
  useEffect(() => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(serialNumberUuid);
      const value = await characteristic.readValue();
      let decoder = new TextDecoder("utf-8");
      let serialNumber = decoder.decode(value);
      const normalizedSerialNumber = serialNumber.substring(0, 8);
      setSerialNumber(normalizedSerialNumber);
      return normalizedSerialNumber;
    };
    AddToQueue(blePayload);
  }, []);

  return <SerialNumber serialNumber={serialNumber} />;
}
