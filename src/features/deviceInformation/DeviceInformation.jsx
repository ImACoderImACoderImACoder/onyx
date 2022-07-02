import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import PrideText from "../../themes/PrideText";

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
