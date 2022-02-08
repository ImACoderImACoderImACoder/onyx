import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import LastAppServerRefresh from "../../features/lastAppRefresh/LastAppRefresh/LastAppServerRefresh";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function DeviceInformation() {
  return (
    <Div>
      <h1>Device Information</h1>
      <LastAppServerRefresh />
      <VolcanoSerialNumber />
      <HoursOfOperation />
      <VolcanoFirmwareVersion />
      <BleFirmwareVersion />
    </Div>
  );
}
