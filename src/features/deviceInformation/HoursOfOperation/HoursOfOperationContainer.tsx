import { useEffect } from "react";
import { convertBLEtoUint16 } from "../../../services/utils";
import HoursOfOperation from "./HoursOfOperation";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  hoursOfOperationUuid,
  minutesOfOperationUuid,
} from "../../../constants/uuids";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../hooks/ts/wrappers";
import { setHoursOfOperation } from "../deviceInformationSlice";
import React from "react";

export default function HoursOfOperationContainer() {
  const dispatch = useDispatch();

  const hours: string | undefined = useSelector(
    (state) => state.deviceInformation.hoursOfOperation.hours
  );

  const minutes = useSelector(
    (state) => state.deviceInformation.hoursOfOperation.minutes
  );

  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  useEffect(() => {
    const fetchOperationTime = () => {
      const blePayload = async () => {
        const hoursOfOperationCharacteristic =
          getCharacteristic(hoursOfOperationUuid);
        const hoursBle = await hoursOfOperationCharacteristic.readValue();
        const currentHoursOfOperation = convertBLEtoUint16(hoursBle);

        const minutesOfOperationCharacteristic = getCharacteristic(
          minutesOfOperationUuid
        );
        const minutesBle = await minutesOfOperationCharacteristic.readValue();
        const currentMinutesOfOperation = convertBLEtoUint16(minutesBle);

        const actionPayload = {
          hours: currentHoursOfOperation,
          minutes: currentMinutesOfOperation,
        };
        dispatch(setHoursOfOperation(actionPayload));
      };
      AddToQueue(blePayload);
    };
    fetchOperationTime();
    const intervalId = setInterval(() => {
      //no need to waste resources for updates if the heat is off since at this time (9/26/22) the heat is the only thing that changes this value
      if (isHeatOn) {
        fetchOperationTime();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, isHeatOn]);

  const hoursOfOperation = hours ? `${hours}h ${minutes}m` : "";
  return <HoursOfOperation hoursOfOperation={hoursOfOperation} />;
}
