export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}

export function convertToUInt8BLE(val) {
  var buffer = new ArrayBuffer(1);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val % 256);
  return buffer;
}

export function convertToUInt32BLE(val) {
  var buffer = new ArrayBuffer(4);
  var dataView = new DataView(buffer);
  dataView.setUint8(0, val & 255);
  var tempVal = val >> 8;
  dataView.setUint8(1, tempVal & 255);
  tempVal = tempVal >> 8;
  dataView.setUint8(2, tempVal & 255);
  tempVal = tempVal >> 8;
  dataView.setUint8(3, tempVal & 255);

  return buffer;
}

export function convertToggleCharacteristicToBool(value, mask) {
  if ((value & mask) === 0) {
    return false;
  }
  return true;
}
