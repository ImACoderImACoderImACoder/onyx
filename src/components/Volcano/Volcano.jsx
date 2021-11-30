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
import LastAppServerRefresh from "../LastAppRefresh/LastAppServerRefresh";
import "./Volcano.css";

function Volcano(props) {
  const [isF, setIsF] = useState(undefined);
  return (
    <div>
      <div className="disconnect-last-synced-div">
        <LastAppServerRefresh renderTimestamp={props.renderTimestamp} />
        <DisconnectButton />
      </div>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
      <FOrC setIsF={setIsF} isF={isF} />
      <div className="footer">
        <div className="footer-main-div">
          <CurrentTemperature isF={isF} />
          <WriteTemperature isF={isF} />

          <div className="heat-air-div">
            <HeatOn />
            <FanOn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Volcano;
