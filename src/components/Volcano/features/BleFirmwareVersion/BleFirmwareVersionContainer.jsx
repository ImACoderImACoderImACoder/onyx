import { useState, useEffect } from "react";
import { bleFirmwareVersionUuid } from "../../../../constants/uuids";
import BleFirmwareVersion from "./BleFirmwareVersion";
import { AddToQueue } from "../../../../services/bleQueueing";
import BleGattOverhead from "../../../../services/BleGattOverhead";

export default function VolcanoFirmwareVersionContainer(props) {
  const [bleFirmwareVersion, setBleFirmwareVersion] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || bleFirmwareVersion) {
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
                .getCharacteristic(bleFirmwareVersionUuid)
                .then((characteristic) => {
                  return characteristic.readValue();
                })

                .then((value) => {
                  let decoder = new TextDecoder("utf-8");
                  let firmwareBLEVersion = decoder.decode(value);
                  setBleFirmwareVersion(firmwareBLEVersion);
                  resolve(firmwareBLEVersion);
                });
            }
          );
        },
      };
      AddToQueue(blePayload);
    }
  }, [props.bleDevice, bleFirmwareVersion]);

  return <BleFirmwareVersion bleFirmwareVersion={bleFirmwareVersion} />;
}
