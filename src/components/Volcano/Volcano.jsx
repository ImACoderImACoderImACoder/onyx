import { useState } from "react";
import DisconnectButton from "./DisconnectButton";
import VolcanoSerialNumber from "./features/SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./features/HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./features/VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./features/BleFirmwareVersion/BleFirmwareVersionContainer";
import HeatOn from "./features/HeatOn/HeatOnContainer";
import FanOn from "./features/FanOn/FanOnContainer";
import FOrC from "./features/FOrC/FOrCContainer";
import CurrentTemperature from "./features/CurrentTemperature/CurrentTemperatureContainer";
import WriteTemperature from "./features/WriteTemperature/WriteTemperatureContainer";

function Volcano() {
  const [isF, setIsF] = useState(undefined);
  return (
    <div>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
      <FOrC setIsF={setIsF} isF={isF} />
      <CurrentTemperature isF={isF} />
      <WriteTemperature isF={isF} />
      <HeatOn />
      <FanOn />
      <DisconnectButton />
    </div>
  );
}

export default Volcano;
