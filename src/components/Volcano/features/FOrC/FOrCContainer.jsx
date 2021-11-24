import { useEffect, useState } from "react";
import { register2Uuid } from "../../../../constants/uuids";
import BleGattOverhead from "../../../../services/BleGattOverhead";
import { fahrenheitMask, celciusMask } from "../../../../constants/masks";
import {
  convertToggleCharacteristicToBool,
  convertBLEtoUint16,
  convertToUInt32BLE,
} from "../../../../services/utils";
import FOrC from "./FOrCLoader";
import { AddToQueue } from "../../../../services/bleQueueing";

export default function FOrCContainer(props) {
  const [isF, setIsF] = useState(undefined);

  useEffect(() => {
    let characteristicPrj2V;
    function handlePrj2ChangedVolcano(event) {
      let currentVal = convertBLEtoUint16(event.target.value);
      if (convertToggleCharacteristicToBool(currentVal, fahrenheitMask)) {
        setIsF(true);
      } else {
        setIsF(false);
      }
    }
    if (!props.bleDevice) {
    } else {
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
    return () => {
      characteristicPrj2V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
    };
  }, [props.bleDevice]);

  const onClick = () => {
    if (isF === undefined) {
      return;
    }
    let characteristicPrj2V;
    const blePayload = {
      then: (resolve) => {
        BleGattOverhead(props.bleDevice).then(
          (
            bleServer,
            primaryServiceUuidVolcano1,
            primaryServiceUuidVolcano2,
            primaryServiceUuidVolcano3
          ) => {
            return primaryServiceUuidVolcano3
              .getCharacteristic(register2Uuid)
              .then((characteristic) => {
                characteristicPrj2V = characteristic;
                const mask = isF ? celciusMask : fahrenheitMask;
                const buffer = convertToUInt32BLE(mask);
                characteristicPrj2V.writeValue(buffer).then((service) => {
                  resolve(`Toggle F or C set to ${isF ? "C" : "F"}`);
                });
              });
          }
        );
      },
    };
    AddToQueue(blePayload);
  };
  return <FOrC isF={isF} onClick={onClick} />;
}
