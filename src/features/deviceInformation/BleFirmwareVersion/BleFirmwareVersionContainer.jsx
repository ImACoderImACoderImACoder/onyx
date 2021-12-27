import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BleFirmwareVersion from "./BleFirmwareVersion";
import { AddToQueue } from "../../../services/bleQueueing";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { bleFirmwareVersionUuid } from "../../../constants/uuids";
import { setBleFirmwareVersion } from "../deviceInformationSlice";

export default function VolcanoFirmwareVersionContainer() {
  const bleFirmwareVersion = useSelector(
    (state) => state.deviceInformation.bleFirmwareVersion
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!bleFirmwareVersion) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(bleFirmwareVersionUuid);
        const value = await characteristic.readValue();
        let decoder = new TextDecoder("utf-8");
        let firmwareBLEVersion = decoder.decode(value);
        dispatch(setBleFirmwareVersion(firmwareBLEVersion));
        return firmwareBLEVersion;
      };
      AddToQueue(blePayload);
    }
  }, [bleFirmwareVersion, dispatch]);

  return <BleFirmwareVersion bleFirmwareVersion={bleFirmwareVersion} />;
}
