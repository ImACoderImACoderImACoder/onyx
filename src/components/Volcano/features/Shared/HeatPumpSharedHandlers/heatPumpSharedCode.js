import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../../../services/utils";
import { AddToQueue } from "../../../../../services/bleQueueing";
import { register1Uuid } from "../../../../../constants/uuids";
import { getCharacteristic } from "../../../../../services/BleCharacteristicCache";

const clickPayload = (
  characteristic,
  setIsToggleOn,
  resolve,
  toggleOnUuid,
  characteristicUuid
) => {
  var buffer = convertToUInt8BLE(0);
  characteristic
    .writeValue(buffer)
    .then((service) => {
      const newState = characteristicUuid === toggleOnUuid;
      console.log(`Setting toggle state to ${newState}`);
      setIsToggleOn(newState);
      resolve(`toggled ${characteristicUuid === toggleOnUuid ? "On" : "Off"}`);
    })
    .catch((error) => {
      alert(
        "hey check this thing out" +
          "\n" +
          error.toString() +
          "\n" +
          error.stack
      );
      resolve("error!");
    });
};
export const getToggleOnClick =
  (isToggleOn, setIsToggleOn, toggleOffUuid, toggleOnUuid) => () => {
    const characteristicCacheId = isToggleOn ? toggleOffUuid : toggleOnUuid;
    const blePayload = {
      then: (resolve) => {
        clickPayload(
          getCharacteristic(characteristicCacheId),
          setIsToggleOn,
          resolve,
          characteristicCacheId,
          toggleOnUuid
        );
      },
    };
    AddToQueue(blePayload);
  };

export const initializeEffectForToggle = (setIsToggleOn, registerMask) => {
  const handlePrj1ChangedVolcano = (mask) => (event) => {
    console.log("we hit the register1 on change");
    let currentVal = convertBLEtoUint16(event.target.value);
    if (convertToggleCharacteristicToBool(currentVal, mask)) {
      setIsToggleOn(true);
    } else {
      setIsToggleOn(false);
    }
  };

  const characteristicPrj1V = getCharacteristic(register1Uuid);
  const blePayload = {
    then: (resolve) => {
      characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano(registerMask)
      );
      characteristicPrj1V.startNotifications();
      characteristicPrj1V.readValue().then((value) => {
        const currentVal = convertBLEtoUint16(value);
        if (convertToggleCharacteristicToBool(currentVal, registerMask)) {
          setIsToggleOn(true);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    },
  };

  AddToQueue(blePayload);

  return () => {
    characteristicPrj1V?.removeEventListener(
      "characteristicvaluechanged",
      handlePrj1ChangedVolcano
    );
  };
};
