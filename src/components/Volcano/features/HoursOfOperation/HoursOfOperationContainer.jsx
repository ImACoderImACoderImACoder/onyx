import { useState, useEffect } from "react";
import { convertBLEtoUint16 } from "../../../../services/utils";

import HoursOfOperation from "./HoursOfOperation";
import { AddToQueue } from "../../../../services/bleQueueing";
import BleGattOverhead from "../../../../services/BleGattOverhead";

export default function HoursOfOperationContainer(props) {
  const [hoursOfOperation, setHoursOfOperation] = useState(undefined);
  useEffect(() => {
    if (!props.bleDevice || hoursOfOperation) {
    } else {
      const func = {
        then: (resolve) => {
          BleGattOverhead(props.bleDevice).then(
            (
              bleService,
              primaryServiceUuidVolcano1,
              primaryServiceUuidVolcano2,
              primaryServiceUuidVolcano3,
              primaryServiceUuidVolcano4
            ) => {
              return primaryServiceUuidVolcano4
                .getCharacteristic("10110015-5354-4f52-5a26-4249434b454c")
                .then((characteristic) => {
                  return characteristic.readValue();
                })
                .then((value) => {
                  const useHoursVolcano = (
                    convertBLEtoUint16(value) / 10
                  ).toString();
                  setHoursOfOperation(useHoursVolcano);
                  resolve(useHoursVolcano);
                });
            }
          );
        },
      };
      AddToQueue(func);
    }
  }, [props.bleDevice, hoursOfOperation]);

  return <HoursOfOperation hoursOfOperation={hoursOfOperation} />;
}
