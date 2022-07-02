import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cacheContainsCharacteristic } from "../../../services/BleCharacteristicCache";
import { heatOffUuid } from "../../../constants/uuids";
import {
  clearCache,
  getCharacteristic,
} from "../../../services/BleCharacteristicCache";
import * as uuIds from "../../../constants/uuids";
import "./Volcano.css";
import ControlsIcon from "./icons/ControlsIcon";
import InformationIcon from "./icons/InformationIcon";
import BluetoothDisconnectIcon from "./icons/BluetoothDisconnectIcon";
import SettingsIcon from "./icons/SettingsIcon";
import MenuBarIcon from "./icons/MenuBarIcon";
import FOrCLoader from "../../settings/FOrC/FOrCLoader";
import { StyledRouterIconLink } from "./icons/Shared/IconLink";
import WorkflowEditorIcon from "./icons/WorkflowEditorIcon";
import PrideText from "../../../themes/PrideText";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styled, { useTheme } from "styled-components";
import ContactMeIcon from "./icons/ContactMeIcon";

const StyledNavBar = styled(Navbar)`
  background: ${(props) => props.theme.backgroundColor};
`;

const StyledNavBarToggle = styled(Navbar.Toggle)`
  background: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor} !important;
  border-width: medium;
`;

const StyledNav = styled(Nav)`
  justify-content: space-evenly;
  flex-grow: 1;
`;

export default function VolcanoLoader(props) {
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });

  const navBarToggleOnClick = () => {
    setExpanded(expanded ? false : "expanded");
  };

  const onLinkClick = () => {
    setExpanded(false);
  };

  const OnDisconnectClick = async () => {
    const bleDevice = getCharacteristic(uuIds.bleDeviceUuid);
    await bleDevice.gatt.disconnect();
    clearCache();
    navigate("/");
  };

  const theme = useTheme();

  return (
    cacheContainsCharacteristic(heatOffUuid) && (
      <div className="main-div">
        <FOrCLoader />
        {
          <StyledNavBar
            expand="lg"
            expanded={expanded}
            onToggle={navBarToggleOnClick}
          >
            <Navbar.Brand>
              <StyledRouterIconLink onClick={onLinkClick} to="/Volcano/App">
                <div>
                  <PrideText text="Project Onyx" />
                </div>
              </StyledRouterIconLink>
            </Navbar.Brand>

            <StyledNavBarToggle
              onClick={navBarToggleOnClick}
              aria-controls="basic-navbar-nav"
            >
              <div
                style={{ color: theme.iconColor }}
                onClick={navBarToggleOnClick}
              >
                <MenuBarIcon />
              </div>
            </StyledNavBarToggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <StyledNav className="me-auto">
                <StyledRouterIconLink onClick={onLinkClick} to="/Volcano/App">
                  {<ControlsIcon />}
                  {
                    <div>
                      <PrideText text="Volcano Controls" />
                    </div>
                  }
                </StyledRouterIconLink>
                <StyledRouterIconLink
                  onClick={onLinkClick}
                  to="/Volcano/WorkflowEditor"
                >
                  {<WorkflowEditorIcon />}
                  {
                    <div>
                      <PrideText text="Workflow Editor" />
                    </div>
                  }
                </StyledRouterIconLink>
                <StyledRouterIconLink
                  onClick={onLinkClick}
                  to="/Volcano/DeviceInformation"
                >
                  {<InformationIcon />}
                  {
                    <div>
                      <PrideText text="Device Information" />
                    </div>
                  }
                </StyledRouterIconLink>
                <StyledRouterIconLink
                  onClick={onLinkClick}
                  to="/Volcano/Settings"
                >
                  {<SettingsIcon />}
                  {
                    <div>
                      <PrideText text="Settings" />
                    </div>
                  }
                </StyledRouterIconLink>
                <StyledRouterIconLink
                  onClick={onLinkClick}
                  to="/Volcano/ContactMe"
                >
                  {<ContactMeIcon />}
                  {
                    <div>
                      <PrideText text="Contact Me" />
                    </div>
                  }
                </StyledRouterIconLink>
                <StyledRouterIconLink
                  style={{
                    marginRight: "0px",
                  }}
                  to="/"
                  onClick={OnDisconnectClick}
                >
                  <BluetoothDisconnectIcon />
                  <div>
                    <PrideText text="Disconnect" />
                  </div>
                </StyledRouterIconLink>
              </StyledNav>
            </Navbar.Collapse>
          </StyledNavBar>
        }
        <Outlet {...props} />
      </div>
    )
  );
}
