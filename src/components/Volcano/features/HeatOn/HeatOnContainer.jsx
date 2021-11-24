import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
  heatOnUuid,
  heatOffUuid,
  heatStatusUuid,
} from "../../../../constants/uuids";
import HeatOn from "./HeatOn";
import { AddToQueue } from "../../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
} from "../../../../services/utils";
import { convertIsHeatOnCharacteristicToBool } from "../../../../services/utils";

export default function HeatOnContainer(props) {
  const [isHeatOn, setIsHeatOn] = useState(false);

  const handlePrj1ChangedVolcano = (event) => {
    console.log("we hit the heat on change");
    let currentVal = convertBLEtoUint16(event.target.value);
    if (convertIsHeatOnCharacteristicToBool(currentVal)) {
      setIsHeatOn(true);
    } else {
      setIsHeatOn(false);
    }
  };

  useEffect(() => {
    let characteristicPrj1V;
    const blePayload = {
      then: (resolve) => {
        let primaryServiceUuidVolcano3;
        let bleServer;
        props.bleDevice.gatt
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
            return primaryServiceUuidVolcano3.getCharacteristic(heatStatusUuid);
          })
          .then((characteristic) => {
            characteristicPrj1V = characteristic;
            characteristicPrj1V.addEventListener(
              "characteristicvaluechanged",
              handlePrj1ChangedVolcano
            );
            characteristic.startNotifications();
            return characteristic.readValue();
          })
          .then((value) => {
            let currentVal = convertBLEtoUint16(value);
            if (convertIsHeatOnCharacteristicToBool(currentVal)) {
              resolve(true);
              setIsHeatOn(true);
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
  }, [props.bleDevice]);

  const onClick = () => {
    let primaryServiceUuidVolcano4;
    let bleServer;
    const blePayload = {
      then: (resolve) => {
        const characteristicUuid = isHeatOn ? heatOffUuid : heatOnUuid;
        props.bleDevice.gatt
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
                const newHeatState = characteristicUuid === heatOnUuid;
                console.log(`Setting heat state to ${newHeatState}`);
                setIsHeatOn(newHeatState);
                resolve(
                  `Heat toggled ${
                    characteristicUuid === heatOnUuid ? "On" : "Off"
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

  return <HeatOn onClick={onClick} isHeatOn={isHeatOn} />;
}
