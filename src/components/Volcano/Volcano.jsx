import DisconnectButton from "./DisconnectButton";
import VolcanoSerialNumber from "./features/SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./features/HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./features/VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./features/BleFirmwareVersion/BleFirmwareVersionContainer";
import HeatOn from "./features/HeatOn/HeatOnContainer";
import FanOn from "./features/FanOn/FanOnContainer";
import FOrC from "./features/FOrC/FOrCContainer";

function Volcano(props) {
  return (
    <div>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
      <FOrC />
      <HeatOn />
      <FanOn />
      <DisconnectButton />
    </div>
  );
}

export default Volcano;
