import { useState, useEffect } from "react";
import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
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
  const [onClick, setOnClick] = useState(() => {});

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
    if (!props.bleDevice || isHeatOn) {
    } else {
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
            // Read Status Register 1
            .then((service) => {
              // Get all characteristics.
              return primaryServiceUuidVolcano3.getCharacteristic(
                "1010000c-5354-4f52-5a26-4249434b454c"
              );
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
    }
  });

  useEffect(() => {
    let primaryServiceUuidVolcano4;
    let bleServer;

    if (!props.bleDevice || isHeatOn) {
    } else {
      const blePayload = {
        then: (resolve) => {
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
                "1011000f-5354-4f52-5a26-4249434b454c"
              );
            })
            .then((characteristic) => {
              var buffer = convertToUInt8BLE(0);
              const characteristicHeaterOn = characteristic;
              characteristicHeaterOn
                .writeValue(buffer)
                .then((service) => {
                  resolve("Heat on");
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
      const handler = () => () => {
        if (!isHeatOn) {
          AddToQueue(blePayload);
          //setIsHeatOn(true);
          // setOnClick(() => {});
        }
      };
      setOnClick(handler);
    }
  }, [props.bleDevice, isHeatOn]);

  return <HeatOn onClick={onClick} isHeatOn={isHeatOn} />;
}
