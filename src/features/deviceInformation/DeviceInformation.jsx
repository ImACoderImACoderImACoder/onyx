import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import { Link } from "react-router-dom";
import "./DeviceInformation.css";

export default function DeviceInformation() {
  return (
    <div className="device-information-main">
      <Link to={"/Volcano/App"}>Back To App</Link>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
    </div>
  );
}
