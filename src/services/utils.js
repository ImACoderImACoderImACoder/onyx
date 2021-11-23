import { heatingMask } from "../constants/masks";

export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}

export function convertToUInt8BLE(val) {
  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  return buffer;
}

export function convertIsHeatOnCharacteristicToBool(value) {
  if ((value & heatingMask) === 0) {
    return false;
  }
  return true;
}
