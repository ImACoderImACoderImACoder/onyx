import { useState, useEffect } from "react";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";
import * as uuIds from "../../../../constants/uuids";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";

export default function VolcanoFirmwareVersionContainer(props) {
  const [volcanoFirmwareVersion, setVolcanoFirmwareVersion] =
    useState(undefined);
  useEffect(() => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(
        uuIds.volcanoFirmwareVersionUuid
      );
      const value = await characteristic.readValue();
      let decoder = new TextDecoder("utf-8");
      let firmwareV = decoder.decode(value);
      const normalizedFirmwareVersion = firmwareV.substring(0, 8);
      setVolcanoFirmwareVersion(normalizedFirmwareVersion);
      return normalizedFirmwareVersion;
    };

    AddToQueue(blePayload);
  }, []);

  return (
    <VolcanoFirmwareVersion volcanoFirmwareVersion={volcanoFirmwareVersion} />
  );
}
