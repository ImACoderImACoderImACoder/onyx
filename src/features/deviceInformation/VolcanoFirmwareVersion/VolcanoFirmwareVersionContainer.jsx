import { useEffect } from "react";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion";
import { AddToQueue } from "../../../services/bleQueueing";
import * as uuIds from "../../../constants/uuids";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setVolcanoFirmwareVersion } from "../deviceInformationSlice";

export default function VolcanoFirmwareVersionContainer() {
  const volcanoFirmwareVersion = useSelector(
    (state) => state.deviceInformation.volcanoFirmwareVersion
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!volcanoFirmwareVersion) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(
          uuIds.volcanoFirmwareVersionUuid
        );
        const value = await characteristic.readValue();
        let decoder = new TextDecoder("utf-8");
        let firmwareV = decoder.decode(value);
        const normalizedFirmwareVersion = firmwareV.substring(0, 8);
        dispatch(setVolcanoFirmwareVersion(normalizedFirmwareVersion));
        return normalizedFirmwareVersion;
      };
      AddToQueue(blePayload);
    }
  }, [volcanoFirmwareVersion, dispatch]);

  return (
    <VolcanoFirmwareVersion volcanoFirmwareVersion={volcanoFirmwareVersion} />
  );
}
