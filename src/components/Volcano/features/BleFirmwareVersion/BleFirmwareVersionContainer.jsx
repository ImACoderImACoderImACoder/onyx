import { useState, useEffect } from "react";
import BleFirmwareVersion from "./BleFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { bleFirmwareVersionUuid } from "../../../../constants/uuids";

export default function VolcanoFirmwareVersionContainer() {
  const [bleFirmwareVersion, setBleFirmwareVersion] = useState(undefined);
  useEffect(() => {
    const blePayload = {
      then: (resolve) => {
        const characteristic = getCharacteristic(bleFirmwareVersionUuid);
        return characteristic.readValue().then((value) => {
          let decoder = new TextDecoder("utf-8");
          let firmwareBLEVersion = decoder.decode(value);
          setBleFirmwareVersion(firmwareBLEVersion);
          resolve(firmwareBLEVersion);
        });
      },
    };
    AddToQueue(blePayload);
  });

  return <BleFirmwareVersion bleFirmwareVersion={bleFirmwareVersion} />;
}
