import { useEffect } from "react";
import { convertBLEtoUint16 } from "../../../services/utils";

import HoursOfOperation from "./HoursOfOperation";
import { AddToQueue } from "../../../services/bleQueueing";
import { hoursOfOperationUuid } from "../../../constants/uuids";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { useDispatch, useSelector } from "react-redux";
import { setHoursOfOperation } from "../deviceInformationSlice";

export default function HoursOfOperationContainer() {
  const dispatch = useDispatch();
  const lastUpdated = useSelector(
    (state) => state.deviceInformation.hoursOfOperation.lastUpdated
  );
  const hours = useSelector(
    (state) => state.deviceInformation.hoursOfOperation.hours
  );
  useEffect(() => {
    const hour = 1000 * 60 * 60;
    const anHourAgo = Date.now() - hour;

    const hasAnHourPassedSinceLastUpdate = lastUpdated < anHourAgo;
    if (!hours || hasAnHourPassedSinceLastUpdate) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(hoursOfOperationUuid);
        const value = await characteristic.readValue();
        const useHoursVolcano = (convertBLEtoUint16(value) / 10).toString();
        const actionPayload = {
          hours: useHoursVolcano,
          lastUpdated: Date.now(),
        };
        dispatch(setHoursOfOperation(actionPayload));
        return useHoursVolcano;
      };
      AddToQueue(blePayload);
    }
  }, [dispatch, hours, lastUpdated]);

  return <HoursOfOperation hoursOfOperation={hours} />;
}
