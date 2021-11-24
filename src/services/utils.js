import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
  register1Uuid,
} from "../constants/uuids";
import { AddToQueue } from "./bleQueueing";

export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}

export function convertToUInt8BLE(val) {
  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  return buffer;
}

export function convertToggleCharacteristicToBool(value, mask) {
  if ((value & mask) === 0) {
    return false;
  }
  return true;
}

export const getToggleOnClick =
  (bleDevice, isToggleOn, setIsToggleOn, toggleOffUuid, toggleOnUuid) => () => {
    let primaryServiceUuidVolcano4;
    let bleServer;
    const blePayload = {
      then: (resolve) => {
        const characteristicUuid = isToggleOn ? toggleOffUuid : toggleOnUuid;
        bleDevice.gatt
          .connect()
          .then((server) => {
            bleServer = server;
            return bleServer.getPrimaryService(serviceUuidVolcano1);
          })
          .then((service) => {
            return bleServer.getPrimaryService(serviceUuidVolcano2);
          })
          .then((service) => {
            return bleServer.getPrimaryService(serviceUuidVolcano3);
          })
          .then((service) => {
            return bleServer.getPrimaryService(serviceUuidVolcano4);
          })
          .then((service) => {
            primaryServiceUuidVolcano4 = service;
          })
          .then((service) => {
            return primaryServiceUuidVolcano4.getCharacteristic(
              characteristicUuid
            );
          })
          .then((characteristic) => {
            var buffer = convertToUInt8BLE(0);
            characteristic
              .writeValue(buffer)
              .then((service) => {
                const newState = characteristicUuid === toggleOnUuid;
                console.log(`Setting toggle state to ${newState}`);
                setIsToggleOn(newState);
                resolve(
                  `toggled ${
                    characteristicUuid === toggleOnUuid ? "On" : "Off"
                  }`
                );
              })
              .catch((error) => {
                alert(
                  "hey check this thing out" +
                    "\n" +
                    error.toString() +
                    "\n" +
                    error.stack
                );
              });
          });
      },
    };
    AddToQueue(blePayload);
  };

export const initializeEffectForToggle = (
  bleDevice,
  setIsToggleOn,
  registerMask
) => {
  if (!bleDevice) {
    return;
  }
  const handlePrj1ChangedVolcano = (mask) => (event) => {
    console.log("we hit the register1 on change");
    let currentVal = convertBLEtoUint16(event.target.value);
    if (convertToggleCharacteristicToBool(currentVal, mask)) {
      setIsToggleOn(true);
    } else {
      setIsToggleOn(false);
    }
  };
  let characteristicPrj1V;
  const blePayload = {
    then: (resolve) => {
      let primaryServiceUuidVolcano3;
      let bleServer;
      bleDevice.gatt
        .connect()
        .then((server) => {
          bleServer = server;
          return bleServer.getPrimaryService(serviceUuidVolcano1);
        })
        .then((service) => {
          return bleServer.getPrimaryService(serviceUuidVolcano2);
        })
        .then((service) => {
          return bleServer.getPrimaryService(serviceUuidVolcano3);
        })
        .then((service) => {
          primaryServiceUuidVolcano3 = service;
          return bleServer.getPrimaryService(serviceUuidVolcano4);
        })
        .then((service) => {
          return primaryServiceUuidVolcano3.getCharacteristic(register1Uuid);
        })
        .then((characteristic) => {
          characteristicPrj1V = characteristic;
          characteristicPrj1V.addEventListener(
            "characteristicvaluechanged",
            handlePrj1ChangedVolcano(registerMask)
          );
          characteristic.startNotifications();
          return characteristic.readValue();
        })
        .then((value) => {
          let currentVal = convertBLEtoUint16(value);
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
