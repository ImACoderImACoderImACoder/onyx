import { useEffect, useState } from "react";
import { register2Uuid } from "../../../../constants/uuids";
import { fahrenheitMask, celciusMask } from "../../../../constants/masks";
import {
  convertToggleCharacteristicToBool,
  convertBLEtoUint16,
  convertToUInt32BLE,
} from "../../../../services/utils";
import FOrC from "./FOrCLoader";
import { AddToQueue } from "../../../../services/bleQueueing";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";

export default function FOrCContainer(props) {
  const [isF, setIsF] = useState(undefined);

  useEffect(() => {
    function handlePrj2ChangedVolcano(event) {
      let currentVal = convertBLEtoUint16(event.target.value);
      if (convertToggleCharacteristicToBool(currentVal, fahrenheitMask)) {
        setIsF(true);
      } else {
        setIsF(false);
      }
    }
    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = {
      then: (resolve) => {
        characteristicPrj2V.readValue().then((value) => {
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
      },
    };
    AddToQueue(blePayload);

    return () => {
      characteristicPrj2V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
    };
  }, []);

  const onClick = () => {
    if (isF === undefined) {
      return;
    }
    const blePayload = {
      then: (resolve) => {
        const characteristicPrj2V = getCharacteristic(register2Uuid);
        const mask = isF ? celciusMask : fahrenheitMask;
        const buffer = convertToUInt32BLE(mask);
        characteristicPrj2V.writeValue(buffer).then((service) => {
          setIsF(!isF);
          resolve(`Toggle F or C set to ${isF ? "C" : "F"}`);
        });
      },
    };
    AddToQueue(blePayload);
  };
  return <FOrC isF={isF} onClick={onClick} />;
}
