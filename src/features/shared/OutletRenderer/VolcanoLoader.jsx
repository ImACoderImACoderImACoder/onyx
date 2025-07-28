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
import { setIsF, setIsMinimalistMode } from "../../settings/settingsSlice";
import { AddToQueue } from "../../../services/bleQueueing";
import { feastOfSaintPatrickId } from "../../../constants/themeIds";
import CurrentWorkflowExecutionDisplay from "../../deviceInteraction/CurrentWorkflowExecutionDisplay.jsx/CurrentWorkflowExecutionDisplay";
import withScrolling from "react-dnd-scrolling";
import AutoOff from "../../deviceInteraction/AutoOff/AutoOff";

const ScrollingDiv = withScrolling("div");

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledNavBar = styled(Navbar)`
  background: ${(props) => props.theme.backgroundColor};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const StyledNavBarToggle = styled(Navbar.Toggle)`
  background: ${(props) => props.theme.backgroundColor};
  border-color: ${(props) => props.theme.iconColor} !important;
  border-width: light;
  padding: 5px;
`;

const StyledNav = styled(Nav)`
  justify-content: flex-end;
  flex-grow: 1;
  margin-left: auto;
  width: 100%;
  text-align: right;
  
  & > * {
    margin-left: auto;
    justify-content: flex-end;
  }
  
  @media (max-width: 991.98px) {
    align-items: flex-end;
    
    & > * {
      align-self: flex-end;
      text-align: right;
    }
  }
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

  const onMinimalistModeClick = () => {
    dispatch(setIsMinimalistMode(true));
    setExpanded(false);
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
    const characteristicPrj1V = getCharacteristic(uuIds.register1Uuid);

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
  }, [dispatch]);

  const readFOrCToStore = useCallback(() => {
    const characteristicPrj2V = getCharacteristic(uuIds.register2Uuid);
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
  }, [dispatch]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const blePayload = async () => {
            const characteristicPrj1V = getCharacteristic(uuIds.register1Uuid);
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
  }, [dispatch, readFOrCToStore]);

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
    const characteristicPrj2V = getCharacteristic(uuIds.register2Uuid);
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
  }, [dispatch]);

  const outletStyling = {
    zIndex: theme.themeId === feastOfSaintPatrickId ? "2" : undefined,
    display: "flex",
    justifyContent: "space-between",
    flexGrow: "1",
  };

  return (
    <MainWrapper>
      <StyledNavBar
        expand="lg"
        expanded={expanded}
        onToggle={navBarToggleOnClick}
      >
        <Container>
          <Navbar.Brand>
            <div style={{ display: "flex" }}>
              <StyledHeaderNavDiv onClick={onLinkClick} to="/Volcano/App">
                <PrideTextWithDiv text="Project Onyx" />
              </StyledHeaderNavDiv>
              <AutoOff style={{ marginLeft: "10px" }} />
              <CurrentWorkflowExecutionDisplay />
            </div>
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
            <StyledNav>
              <StyledRouterIconLink onClick={onLinkClick} to="/Volcano/App">
                {<PrideTextWithDiv text="Controls" />}
                {<ControlsIcon />}
              </StyledRouterIconLink>
              <StyledRouterIconLink
                as="div"
                onClick={onMinimalistModeClick}
                style={{ cursor: "pointer" }}
              >
                <PrideTextWithDiv text="Mini Mode" />
                <MenuBarIcon />
              </StyledRouterIconLink>
              <StyledRouterIconLink
                onClick={onLinkClick}
                to="/Volcano/WorkflowEditor"
              >
                {<PrideTextWithDiv text="Workflow Editor" />}
                {<WorkflowEditorIcon />}
              </StyledRouterIconLink>
              <StyledRouterIconLink
                onClick={onLinkClick}
                to="/Volcano/ContactMe"
              >
                {<PrideTextWithDiv text="Contact Me" />}
                {<ContactMeIcon />}
              </StyledRouterIconLink>
              <StyledRouterIconLink
                onClick={onLinkClick}
                to="/Volcano/Settings"
              >
                {<PrideTextWithDiv text="Settings" />}
                {<SettingsIcon />}
              </StyledRouterIconLink>

              <StyledRouterIconLink to="/" onClick={OnDisconnectClick}>
                <PrideTextWithDiv text="Disconnect" />
                <BluetoothDisconnectIcon />
              </StyledRouterIconLink>
            </StyledNav>
          </Navbar.Collapse>
        </Container>
      </StyledNavBar>

      <ContentWrapper>
        <ScrollingDiv className="main-div">
          <div style={outletStyling}>
            <Outlet {...props} />
          </div>
        </ScrollingDiv>
      </ContentWrapper>
    </MainWrapper>
  );
}
