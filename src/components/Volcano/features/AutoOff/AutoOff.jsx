import { getCharacteristic } from "../../../../services/BleCharacteristicCache";
import { autoShutoffUuid } from "../../../../constants/uuids";
import { useEffect } from "react";
import { convertBLEtoUint16 } from "../../../../services/utils";
import { AddToQueue } from "../../../../services/bleQueueing";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAutoOffTimeInSeconds } from "../../../../features/deviceInformation/deviceInformationSlice";

export default function AutoOff() {
  const autoOffTime = useSelector(
    (state) => state.deviceInformation.autoOffTimeInSeconds
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalFunction = () => {
      const blePayload = async () => {
        const characteristic = getCharacteristic(autoShutoffUuid);
        const value = await characteristic.readValue();
        const actualValue = convertBLEtoUint16(value);
        dispatch(setAutoOffTimeInSeconds(actualValue));
        return `auto off value is ${actualValue} seconds`;
      };
      AddToQueue(blePayload);
    };
    intervalFunction();
    const intervalId = setInterval(() => {
      intervalFunction();
    }, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  });
  return <div>{`Turning off in ${Math.round(autoOffTime / 60)} minutes`} </div>;
}
