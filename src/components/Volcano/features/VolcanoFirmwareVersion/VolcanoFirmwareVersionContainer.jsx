import { useState, useEffect } from "react";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion";
import { volcanoFirmwareVersionUuid } from "../../../../constants/uuids";
import { AddToQueue } from "../../../../services/bleQueueing";
import BleGattOverhead from "../../../../services/BleGattOverhead";

export default function VolcanoFirmwareVersionContainer(props) {
  const [volcanoFirmwareVersion, setVolcanoFirmwareVersion] =
    useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || volcanoFirmwareVersion) {
    } else {
      const blePayload = {
        then: (resolve) => {
          BleGattOverhead(props.bleDevice).then(
            (
              bleService,
              primaryServiceUuidVolcano1,
              primaryServiceUuidVolcano2,
              primaryServiceUuidVolcano3
            ) => {
              return primaryServiceUuidVolcano3
                .getCharacteristic(volcanoFirmwareVersionUuid)
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
            }
          );
        },
      };
      AddToQueue(blePayload);
    }
  }, [props.bleDevice, volcanoFirmwareVersion]);

  return (
    <VolcanoFirmwareVersion volcanoFirmwareVersion={volcanoFirmwareVersion} />
  );
}
