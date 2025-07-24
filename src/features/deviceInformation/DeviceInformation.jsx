import VolcanoSerialNumber from "./SerialNumber/SerialNumberContainer";
import HoursOfOperation from "./HoursOfOperation/HoursOfOperationContainer";
import VolcanoFirmwareVersion from "./VolcanoFirmwareVersion/VolcanoFirmwareVersionContainer";
import BleFirmwareVersion from "./BleFirmwareVersion/BleFirmwareVersionContainer";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import PrideText from "../../themes/PrideText";
import HeatOn from "../deviceInteraction/HeatOn/HeatOnContainer";
import FanOn from "../deviceInteraction/FanOn/FanOnContainer";
import styled from "styled-components";

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 0 20px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 20px 16px 0;
  padding: 16px;
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  max-width: 400px;

  /* Make heat/fan buttons taller on device info page */
  .heat-air-button {
    min-height: 80px;
  }

  @media (min-width: 768px) {
    gap: 20px;
    margin: 30px auto 0;
    padding: 20px;
  }
`;

export default function DeviceInformation() {
  return (
    <Div>
      <PageHeader>
        <h1>
          <PrideText text="Device Information" />
        </h1>
      </PageHeader>
      <InfoGrid>
        <VolcanoSerialNumber />
        <HoursOfOperation />
        <VolcanoFirmwareVersion />
        <BleFirmwareVersion />
      </InfoGrid>
    </Div>
  );
}

export function DeviceInformationWithToggleControls() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
      <Div>
        <PageHeader>
          <h1>
            <PrideText text="Device Information" />
          </h1>
        </PageHeader>
        <InfoGrid>
          <VolcanoSerialNumber />
          <HoursOfOperation />
          <VolcanoFirmwareVersion />
          <BleFirmwareVersion />
        </InfoGrid>
        <ControlsContainer>
          <HeatOn />
          <FanOn />
        </ControlsContainer>
      </Div>
    </div>
  );
}
