import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import Socials from "./Meta/Socials";
import PrideText from "../../themes/PrideText";
import Contact from "./Contact";

export default function DeviceInformation() {
  return (
    <Div>
      <h1><PrideText text="Device Information" /></h1>
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
      <Socials />
      <Contact />
    </Div>
  );
}
