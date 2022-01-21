import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../../../services/utils";
import { AddToQueue } from "../../../../../services/bleQueueing";
import { register1Uuid } from "../../../../../constants/uuids";
import { getCharacteristic } from "../../../../../services/BleCharacteristicCache";

const clickPayload = async (
  characteristic,
  setIsToggleOn,
  toggleOnUuid,
  characteristicUuid
) => {
  var buffer = convertToUInt8BLE(0);
  try {
    await characteristic.writeValue(buffer);
    const newState = characteristicUuid === toggleOnUuid;
    console.log(`Setting toggle state to ${newState}`);
    setIsToggleOn(newState);
    return `toggled ${characteristicUuid === toggleOnUuid ? "On" : "Off"}`;
  } catch (error) {
    return error.toString();
  }
};
export const getToggleOnClick =
  (isToggleOn, setIsToggleOn, toggleOffUuid, toggleOnUuid) => () => {
    const characteristicCacheId = isToggleOn ? toggleOffUuid : toggleOnUuid;
    const blePayload = async () => {
      return await clickPayload(
        getCharacteristic(characteristicCacheId),
        setIsToggleOn,
        characteristicCacheId,
        toggleOnUuid
      );
    };
    AddToQueue(blePayload);
  };

export const initializeEffectForToggle = (setIsToggleOn, registerMask) => {
  const handlePrj1ChangedVolcano = (mask) => (event) => {
    let currentVal = convertBLEtoUint16(event.target.value);
    if (convertToggleCharacteristicToBool(currentVal, mask)) {
      setIsToggleOn(true);
    } else {
      setIsToggleOn(false);
    }
  };

  const characteristicPrj1V = getCharacteristic(register1Uuid);
  const blePayload = async () => {
    await characteristicPrj1V.addEventListener(
      "characteristicvaluechanged",
      handlePrj1ChangedVolcano(registerMask)
    );
    await characteristicPrj1V.startNotifications();
    const value = await characteristicPrj1V.readValue();
    const currentVal = convertBLEtoUint16(value);
    if (convertToggleCharacteristicToBool(currentVal, registerMask)) {
      setIsToggleOn(true);
      return true;
    } else {
      return false;
    }
  };

  AddToQueue(blePayload);

  return () => {
    const blePayload = async () => {
      await characteristicPrj1V?.removeEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
    };
    AddToQueue(blePayload);
  };
};
