import { useState, useEffect } from "react";
import { convertBLEtoUint16 } from "../../../../services/utils";

import HoursOfOperation from "./HoursOfOperation";
import { AddToQueue } from "../../../../services/bleQueueing";
import { hoursOfOperationUuid } from "../../../../constants/uuids";
import { getCharacteristic } from "../../../../services/BleCharacteristicCache";

export default function HoursOfOperationContainer() {
  const [hoursOfOperation, setHoursOfOperation] = useState(undefined);
  useEffect(() => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(hoursOfOperationUuid);
      const value = await characteristic.readValue();
      const useHoursVolcano = (convertBLEtoUint16(value) / 10).toString();
      setHoursOfOperation(useHoursVolcano);
      return useHoursVolcano;
    };
    AddToQueue(blePayload);
  }, []);

  return <HoursOfOperation hoursOfOperation={hoursOfOperation} />;
}
