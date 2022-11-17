import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
import { StyledRouterIconLink } from "./icons/Shared/IconLink";
import WorkflowEditorIcon from "./icons/WorkflowEditorIcon";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styled, { useTheme } from "styled-components";
import ContactMeIcon from "./icons/ContactMeIcon";
import CurrentWorkflowExecutionDisplay from "../../deviceInteraction/CurrentWorkflowExecutionDisplay.jsx/CurrentWorkflowExecutionDisplay";
import Container from "react-bootstrap/Container";
import { heatingMask, fanMask, fahrenheitMask } from "../../../constants/masks";
import {
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../../services/utils";
import { useDispatch, useSelector } from "react-redux";
import store from "../../../store";
import {
  setIsHeatOn,
  setIsFanOn,
} from "../../deviceInteraction/deviceInteractionSlice";
import { setIsF } from "../../settings/settingsSlice";
import { AddToQueue } from "../../../services/bleQueueing";

const StyledNavBar = styled(Navbar)`
  background: ${(props) => props.theme.backgroundColor};
`;

const StyledNavBarToggle = styled(Navbar.Toggle)`
  background: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.iconColor} !important;
  border-width: medium;
  padding: 5px;
`;

const StyledNav = styled(Nav)`
  justify-content: space-evenly;
  flex-grow: 1;
`;

const StyledHeaderNavDiv = styled(StyledRouterIconLink)`
  color: ${(props) => props.theme.iconColor};
`;

export default function VolcanoLoader(props) {
  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const characteristicPrj1V = getCharacteristic(uuIds.register1Uuid);
  const characteristicPrj2V = getCharacteristic(uuIds.register2Uuid);

  useEffect(() => {
    const handlePrj1ChangedVolcano = (event) => {
      let currentVal = convertBLEtoUint16(event.target.value);
      const newHeatValue = convertToggleCharacteristicToBool(
        currentVal,
        heatingMask
      );
      if (store.getState().deviceInteraction.isHeatOn !== newHeatValue) {
        dispatch(setIsHeatOn(newHeatValue));
      }

      currentVal = convertBLEtoUint16(event.target.value);
      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );
      if (store.getState().deviceInteraction.isFanOn !== newFanValue) {
        dispatch(setIsFanOn(newFanValue));
      }
    };

    const blePayload = async () => {
      await characteristicPrj1V.addEventListener(
        "characteristicvaluechanged",
        handlePrj1ChangedVolcano
      );
      await characteristicPrj1V.startNotifications();
    };
    AddToQueue(blePayload);

    return () => {
      const blePayload = async () => {
        await characteristicPrj1V?.removeEventListener(
          "characteristicvaluechanged",
          handlePrj1ChangedVolcano
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch, characteristicPrj1V]);

  const readFOrCToStore = useCallback(() => {
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      const convertedValue = convertBLEtoUint16(value);
      const isFValue = convertToggleCharacteristicToBool(
        convertedValue,
        fahrenheitMask
      );
      if (store.getState().settings.isF !== isFValue) {
        dispatch(setIsF(isFValue));
      }
    };
    AddToQueue(blePayload);
  }, [dispatch, characteristicPrj2V]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const value = await characteristicPrj1V.readValue();
            const currentVal = convertBLEtoUint16(value);
            const newHeatValue = convertToggleCharacteristicToBool(
              currentVal,
              heatingMask
            );
            if (store.getState().deviceInteraction.isHeatOn !== newHeatValue) {
              dispatch(setIsHeatOn(newHeatValue));
            }
          };
          AddToQueue(blePayload);
        }, 250);

        setTimeout(() => {
          readFOrCToStore();
        }, 250);
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch, readFOrCToStore, characteristicPrj1V]);

  //bind event handlers for register2
  useEffect(() => {
    function handlePrj2ChangedVolcano(event) {
      const currentVal = convertBLEtoUint16(event.target.value);
      const changedValue = convertToggleCharacteristicToBool(
        currentVal,
        fahrenheitMask
      );
      if (store.getState().settings.isF !== changedValue) {
        dispatch(setIsF(changedValue));
      }
    }
    const blePayload = async () => {
      await characteristicPrj2V.addEventListener(
        "characteristicvaluechanged",
        handlePrj2ChangedVolcano
      );
      await characteristicPrj2V.startNotifications();
    };

    AddToQueue(blePayload);
    return () => {
      const blePayload = async () => {
        await characteristicPrj2V?.removeEventListener(
          "characteristicvaluechanged",
          handlePrj2ChangedVolcano
        );
      };
      AddToQueue(blePayload);
    };
  }, [dispatch, characteristicPrj2V]);

  return (
    <div className="main-div">
      {
        <StyledNavBar
          expand="lg"
          expanded={expanded}
          onToggle={navBarToggleOnClick}
        >
          <Container>
            <Navbar.Brand>
              <StyledHeaderNavDiv onClick={onLinkClick} to="/Volcano/App">
                <PrideTextWithDiv text="Project Onyx" />
              </StyledHeaderNavDiv>
            </Navbar.Brand>

            <StyledNavBarToggle
              onClick={navBarToggleOnClick}
              aria-controls="basic-navbar-nav"
            >
              <div
                style={{ color: theme.primaryFontColor }}
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
      <CurrentWorkflowExecutionDisplay />
      <Outlet {...props} />
    </div>
  );
}
