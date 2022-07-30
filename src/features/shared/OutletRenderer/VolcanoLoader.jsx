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
import { PrideTextWithDiv } from "../../../themes/PrideText";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styled, { useTheme } from "styled-components";
import ContactMeIcon from "./icons/ContactMeIcon";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";

const StyledNavBar = styled(Navbar)`
  background: ${(props) => props.theme.backgroundColor};
`;

const StyledNavBarToggle = styled(Navbar.Toggle)`
  background: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.borderColor} !important;
  border-width: medium;
  padding: 5px;
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

  /* eslint-disable no-unused-vars */
  //little hack to make Pridetext reaminate when these states change
  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  /* eslint-enable no-unused-vars */

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
            <Container>
              <Navbar.Brand>
                <StyledRouterIconLink onClick={onLinkClick} to="/Volcano/App">
                  <PrideTextWithDiv text="Project Onyx" />
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
                    {<PrideTextWithDiv text="Controls" />}
                  </StyledRouterIconLink>
                  <StyledRouterIconLink
                    onClick={onLinkClick}
                    to="/Volcano/WorkflowEditor"
                  >
                    {<WorkflowEditorIcon />}
                    {<PrideTextWithDiv text="Workflow Editor" />}
                  </StyledRouterIconLink>
                  <StyledRouterIconLink
                    onClick={onLinkClick}
                    to="/Volcano/DeviceInformation"
                  >
                    {<InformationIcon />}
                    {<PrideTextWithDiv text="Device Info" />}
                  </StyledRouterIconLink>
                  <StyledRouterIconLink
                    onClick={onLinkClick}
                    to="/Volcano/Settings"
                  >
                    {<SettingsIcon />}
                    {<PrideTextWithDiv text="Settings" />}
                  </StyledRouterIconLink>
                  <StyledRouterIconLink
                    onClick={onLinkClick}
                    to="/Volcano/ContactMe"
                  >
                    {<ContactMeIcon />}
                    {<PrideTextWithDiv text="Contact Me" />}
                  </StyledRouterIconLink>
                  <StyledRouterIconLink to="/" onClick={OnDisconnectClick}>
                    <BluetoothDisconnectIcon />
                    <PrideTextWithDiv text="Disconnect" />
                  </StyledRouterIconLink>
                </StyledNav>
              </Navbar.Collapse>
            </Container>
          </StyledNavBar>
        }
        <Outlet {...props} />
      </div>
    )
  );
}
