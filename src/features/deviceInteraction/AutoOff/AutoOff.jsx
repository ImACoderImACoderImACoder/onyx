import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import {
  autoShutoffUuid,
  autoShutoffSettingUuid,
} from "../../../constants/uuids";
import { useEffect, useRef } from "react";
import { convertBLEtoUint16 } from "../../../services/utils";
import { AddToQueue } from "../../../services/bleQueueing";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAutoOffTimeInSeconds } from "../../deviceInformation/deviceInformationSlice";
import { setAutoShutoffTime } from "../../settings/settingsSlice";
import AutoOffLoadingCircle from "./AutoOffCircle";

export default function AutoOff(props) {
  const autoOffTimeInSeconds = useSelector(
    (state) => state.deviceInformation.autoOffTimeInSeconds
  );
  const autoShutoffTimeSetting = useSelector(
    (state) => state.settings.autoShutoffTime
  );

  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const isHeatOnRef = useRef(isHeatOn);
  isHeatOnRef.current = isHeatOn;
  const autoOffTimeInSecondsRef = useRef(autoOffTimeInSeconds);
  autoOffTimeInSecondsRef.current = autoOffTimeInSeconds;
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalFunction = () => {
      const blePayload = async () => {
        if (!isHeatOnRef.current) {
          return;
        }

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
    //i care about your battery
    const aggressiveInterval = setInterval(() => {
      if (!autoOffTimeInSecondsRef.current > 0 && isHeatOnRef.current) {
        intervalFunction();
      } else {
        clearInterval(aggressiveInterval);
      }
    }, 1000 * 1);

    const chillInterval = setInterval(() => {
      intervalFunction();
    }, 1000 * 60);

    if (!isHeatOn) {
      dispatch(setAutoOffTimeInSeconds(0));
    }

    return () => {
      clearInterval(aggressiveInterval);
      clearInterval(chillInterval);
    };
  }, [dispatch, isHeatOn]);
  const autoShutoffTimeInMinutes = Math.floor(autoOffTimeInSeconds / 60);
  const now = Math.floor(
    (autoShutoffTimeInMinutes / autoShutoffTimeSetting) * 100
  );

  return (
    <AutoOffLoadingCircle
      value={now}
      minutesLeft={autoShutoffTimeInMinutes || (isHeatOn && "< 1")}
      {...props}
      style={{
        ...props.style,
        opacity: isHeatOn && autoOffTimeInSeconds !== 0 ? "1" : "0",
        transition: "all 0.35s",
      }}
    />
  );
}
