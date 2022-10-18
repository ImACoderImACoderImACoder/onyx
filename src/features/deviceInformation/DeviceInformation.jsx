import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import PrideText from "../../themes/PrideText";
import HeatOn from "../deviceInteraction/HeatOn/HeatOnContainer";
import FanOn from "../deviceInteraction/FanOn/FanOnContainer";

export default function DeviceInformation() {
  return (
    <Div>
      <h1>
        <PrideText text="Device Information" />
      </h1>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
    </Div>
  );
}

export function DeviceInformationWithToggleControls() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
      <DeviceInformation />
      <Div style={{ justifyContent: "end" }}>
        <div className="heat-air-div">
          <HeatOn />
          <FanOn />
        </div>
      </Div>
    </div>
  );
}
