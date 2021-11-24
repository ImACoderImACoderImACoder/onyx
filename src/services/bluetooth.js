import {
  serviceUuidVolcano1,
  serviceUuidVolcano2,
  serviceUuidVolcano3,
  serviceUuidVolcano4,
  serviceUuidVolcano5,
} from "../constants/uuids";

let bluetoothDevice;

function onDisconnected() {
  window.location.reload();
}

const bluetoothThenable = {
  then: (resolve, reject) => {
    if (bluetoothDevice) {
      resolve(bluetoothDevice);
    }

    if (navigator.bluetooth) {
      var pieces = navigator.userAgent.match(
        /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
      );

      if (pieces != null) {
        pieces = pieces.map((piece) => parseInt(piece, 10));

        if (pieces.length > 0 && pieces[0] < 79) {
          alert("Chrome Version kleiner 79, bitte Browser updaten");
        }
      }

      let filters = [];
      let filterNamePrefixVolcano = "S&B";

      filters.push({ namePrefix: filterNamePrefixVolcano });

      let options = {};

      if (
        window.navigator.userAgent.includes("iPhone") ||
        window.navigator.userAgent.includes("iPad")
      ) {
        options.filters = filters;
        options.acceptAllDevices = false;
      } else if (
        window.navigator.userAgent.toLowerCase().indexOf("android") > -1
      ) {
        filters.push({
          services: [
            serviceUuidVolcano1,
            serviceUuidVolcano2,
            serviceUuidVolcano3,
            serviceUuidVolcano4,
            serviceUuidVolcano5,
          ],
        });
        options.filters = filters;
        options.acceptAllDevices = false;
      } else {
        filters.push({
          services: [
            serviceUuidVolcano1,
            serviceUuidVolcano2,
            serviceUuidVolcano3,
            serviceUuidVolcano4,
            serviceUuidVolcano5,
          ],
        });
        options.filters = filters;
        options.acceptAllDevices = false;
      }
      navigator.bluetooth
        .requestDevice(options)
        .then((device) => {
          if (device.name.includes("S&B VOLCANO")) {
            bluetoothDevice = device;

            bluetoothDevice.addEventListener(
              "gattserverdisconnected",
              onDisconnected
            );
            resolve(bluetoothDevice);
          }
        })
        .catch((error) => {
          if (
            error.toString().includes("User cancelled") ||
            error.toString().includes("a user gesture")
          ) {
            bluetoothDevice = undefined;
            reject("Ble canceled");
          } else {
            const alertMessage =
              "BLE connection issue, please reset web page and retry!\n" +
              error.toString() +
              "\n" +
              error.stack;
            alert(alertMessage);
            reject(alertMessage);
          }
        });
    } else {
      const bleNotSupported = "WEB BLE not supported";
      alert(bleNotSupported);
      reject(bleNotSupported);
      return;
    }
  },
};

export default bluetoothThenable;
