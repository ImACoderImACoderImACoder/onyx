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
import CurrentTargetTemperature from "./features/WriteTemperature/CurrentTargetTemperature";
import { getDisplayTemperature } from "../../services/utils";
import "./Volcano.css";

function Volcano(props) {
  const [isF, setIsF] = useState(undefined);
  const [currentTargetTemperature, setCurrentTargetTemperature] =
    useState(undefined);

  return (
    <div className="main-div">
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
      </div>
      <div>
        <CurrentTemperature isF={isF} />
        <CurrentTargetTemperature
          currentTargetTemperature={getDisplayTemperature(
            currentTargetTemperature,
            isF
          )}
        />
        <WriteTemperature
          isF={isF}
          currentTargetTemperature={currentTargetTemperature}
          setCurrentTargetTemperature={setCurrentTargetTemperature}
        />

        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </div>
    </div>
  );
}

export default Volcano;
