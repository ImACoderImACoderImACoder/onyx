import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import {
  autoShutoffUuid,
  autoShutoffSettingUuid,
} from "../../../constants/uuids";
import { useEffect } from "react";
import { convertBLEtoUint16 } from "../../../services/utils";
import { AddToQueue } from "../../../services/bleQueueing";
import { useSelector } from "react-redux";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDispatch } from "react-redux";
import { setAutoOffTimeInSeconds } from "../../deviceInformation/deviceInformationSlice";
import { setAutoShutoffTime } from "../../settings/settingsSlice";
export default function AutoOff() {
  const autoOffTimeInSeconds = useSelector(
    (state) => state.deviceInformation.autoOffTimeInSeconds
  );
  const autoShutoffTimeSetting = useSelector(
    (state) => state.settings.autoShutoffTime
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalFunction = () => {
      const blePayload = async () => {
        const characteristic = getCharacteristic(autoShutoffUuid);
        const value = await characteristic.readValue();
        const actualValue = convertBLEtoUint16(value);
        dispatch(setAutoOffTimeInSeconds(actualValue));
      };
      const blePayload2 = async () => {
        const characteristic = getCharacteristic(autoShutoffSettingUuid);
        const value = await characteristic.readValue();
        const normalizedValue = convertBLEtoUint16(value) / 60;
        dispatch(setAutoShutoffTime(normalizedValue));
      };
      AddToQueue(blePayload);
      AddToQueue(blePayload2);
    };
    intervalFunction();
    const intervalId = setInterval(() => {
      intervalFunction();
    }, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  });
  const autoShutoffTimeInMinutes = Math.floor(autoOffTimeInSeconds / 60);
  const now = Math.floor(
    (autoShutoffTimeInMinutes / autoShutoffTimeSetting) * 100
  );
  return (
    <ProgressBar
      now={now}
      style={{
        maxWidth: "70%",
        marginLeft: "30px",
      }}
      label={`Auto off in ${autoShutoffTimeInMinutes} minutes`}
    />
  );
}
