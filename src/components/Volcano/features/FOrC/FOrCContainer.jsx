import { useEffect, useState } from "react";
import { register2Uuid } from "../../../../constants/uuids";
import BleGattOverhead from "../../../../services/BleGattOverhead";
import { fahrenheitMask } from "../../../../constants/masks";
import {
  convertToggleCharacteristicToBool,
  convertBLEtoUint16,
} from "../../../../services/utils";
import FOrC from "./FOrCLoader";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function FOrCContainer(props) {
  const [isF, setIsF] = useState(undefined);

  useEffect(() => {
    if (!props.bleDevice) {
    } else {
      function handlePrj2ChangedVolcano(event) {
        let currentVal = convertBLEtoUint16(event.target.value);
        if (convertToggleCharacteristicToBool(currentVal, fahrenheitMask)) {
          setIsF(true);
        } else {
          setIsF(false);
        }
      }
      const blePayload = {
        then: (resolve) => {
          BleGattOverhead(props.bleDevice).then(
            (
              bleService,
              primaryServiceUuidVolcano1,
              primaryServiceUuidVolcano2,
              primaryServiceUuidVolcano3,
              primaryServiceUuidVolcano4
            ) => {
              let characteristicPrj2V;
              return primaryServiceUuidVolcano3
                .getCharacteristic(register2Uuid)
                .then((characteristic) => {
                  characteristicPrj2V = characteristic;
                  return characteristicPrj2V.readValue();
                })
                .then((value) => {
                  let currentVal = convertBLEtoUint16(value);
                  characteristicPrj2V.addEventListener(
                    "characteristicvaluechanged",
                    handlePrj2ChangedVolcano
                  );
                  characteristicPrj2V.startNotifications();
                  const isFValue = convertToggleCharacteristicToBool(
                    currentVal,
                    fahrenheitMask
                  );
                  setIsF(isFValue);
                  resolve(isFValue);
                });
            }
          );
        },
      };
      AddToQueue(blePayload);
    }
  }, [props.bleDevice]);

  return <FOrC isF={isF} />;
}
