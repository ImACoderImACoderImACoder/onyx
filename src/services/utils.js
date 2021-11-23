export function convertBLEtoUint16(bleBuf) {
  return bleBuf.getUint8(0) + bleBuf.getUint8(1) * 256;
}
