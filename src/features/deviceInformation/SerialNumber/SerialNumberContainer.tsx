import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SerialNumber from "./SerialNumber";
import { serialNumberUuid } from "../../../constants/uuids";
import { AddToQueue } from "../../../services/bleQueueing";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { setSerialNumber } from "../deviceInformationSlice";
import { useSelector } from "../../../hooks/ts/wrappers";
import React from "react";

export default function ReadSerialNumber() {
  const serialNumber: string | undefined = useSelector(
    (state) => state.deviceInformation.serialNumber
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!serialNumber) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(serialNumberUuid);
        const value = await characteristic.readValue();
        let decoder = new TextDecoder("utf-8");
        let serialNumber = decoder.decode(value);
        const normalizedSerialNumber = serialNumber.substring(0, 8);
        dispatch(setSerialNumber(normalizedSerialNumber));
      };
      AddToQueue(blePayload);
    }
  }, [serialNumber, dispatch]);

  return <SerialNumber serialNumber={serialNumber || ""} />;
}
