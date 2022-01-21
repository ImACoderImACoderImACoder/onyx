import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cacheContainsCharacteristic } from "../../services/BleCharacteristicCache";
import { heatOffUuid } from "../../constants/uuids";
import DisconnectButton from "./DisconnectButton";

import "./Volcano.css";
import ControlsIcon from "./icons/ControlsIcon";
import InformationIcon from "./icons/InformationIcon";
import SettingsIcon from "./icons/SettingsIcon";
import FOrCLoader from "./features/FOrC/FOrCLoader";
import styled from "styled-components";

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.iconTextColor};
`;

export default function VolcanoLoader(props) {
  const navigate = useNavigate();
  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });

  return (
    cacheContainsCharacteristic(heatOffUuid) && (
      <div className="main-div">
        <FOrCLoader />
        <div className="disconnect-last-synced-div">
          <StyledLink to={"/Volcano/App"}>
            <ControlsIcon />
            App
          </StyledLink>
          <StyledLink to={"/Volcano/DeviceInformation"}>
            <InformationIcon />
            Device Info
          </StyledLink>
          <StyledLink to={"/Volcano/Settings"}>
            <SettingsIcon />
            Settings
          </StyledLink>
          <DisconnectButton />
        </div>
        <Outlet {...props} />
      </div>
    )
  );
}
