import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import LastAppServerRefresh from "../../features/lastAppRefresh/LastAppRefresh/LastAppServerRefresh";
import "./DeviceInformation.css";

export default function DeviceInformation() {
  return (
    <div className="device-information-main">
      <LastAppServerRefresh />
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
    </div>
  );
}
