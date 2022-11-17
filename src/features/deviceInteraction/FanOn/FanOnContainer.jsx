import { useEffect } from "react";
import { fanOnUuid, fanOffUuid } from "../../../constants/uuids";
import FanOn from "./FanOn";
import { useSelector } from "react-redux";
import { AddToPriorityQueue } from "../../../services/bleQueueing";
import { convertToUInt8BLE } from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useCallback } from "react";
import { useRef } from "react";

export default function FanOnContainer() {
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);

  const onClick = useCallback((nextState) => {
    const blePayload = async () => {
      const targetCharacteristicUuid = nextState ? fanOnUuid : fanOffUuid;
      const characteristic = getCharacteristic(targetCharacteristicUuid);
      const buffer = convertToUInt8BLE(0);
      await characteristic.writeValue(buffer);
    };
    AddToPriorityQueue(blePayload);
  }, []);

  const fanOnRef = useRef(null);
  const spaceBarKeycode = 32;
  useEffect(() => {
    const handler = (e) => {
      if (e.keyCode === spaceBarKeycode) {
        fanOnRef.current.click();
      }
    };
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, [onClick]);

  return <FanOn ref={fanOnRef} onChange={onClick} isFanOn={isFanOn} />;
}
