import { useState, useEffect } from "react";
import BleFirmwareVersion from "./BleFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { bleFirmwareVersionUuid } from "../../../../constants/uuids";

export default function VolcanoFirmwareVersionContainer() {
  const [bleFirmwareVersion, setBleFirmwareVersion] = useState(undefined);
  useEffect(() => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(bleFirmwareVersionUuid);
      const value = await characteristic.readValue();
      let decoder = new TextDecoder("utf-8");
      let firmwareBLEVersion = decoder.decode(value);
      setBleFirmwareVersion(firmwareBLEVersion);
      return firmwareBLEVersion;
    };
    AddToQueue(blePayload);
  }, []);

  return <BleFirmwareVersion bleFirmwareVersion={bleFirmwareVersion} />;
}
