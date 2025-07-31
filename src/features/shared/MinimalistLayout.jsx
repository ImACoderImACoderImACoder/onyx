import { useDispatch, useSelector } from "react-redux";
import { setIsMinimalistMode } from "../settings/settingsSlice";
import styled, { keyframes, css } from "styled-components";
import WriteTemperature from "../deviceInteraction/WriteTemperature/WriteTemperature";
import PrideText from "../../themes/PrideText";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { StyledRouterIconLink } from "./OutletRenderer/icons/Shared/IconLink";
import SettingsIcon from "./OutletRenderer/icons/SettingsIcon";
import ContactMeIcon from "./OutletRenderer/icons/ContactMeIcon";
import WorkflowEditorIcon from "./OutletRenderer/icons/WorkflowEditorIcon";
import WorkFlow from "../workflowEditor/WorkflowButtons";
import CurrentWorkflowExecutionDisplay from "../deviceInteraction/CurrentWorkflowExecutionDisplay.jsx/CurrentWorkflowExecutionDisplay";
import {
  setIsHeatOn,
  setIsFanOn,
} from "../deviceInteraction/deviceInteractionSlice";
import { setAutoOffTimeInSeconds } from "../deviceInformation/deviceInformationSlice";
import {
  getCharacteristic,
  clearCache,
} from "../../services/BleCharacteristicCache";
import {
  heatOnUuid,
  heatOffUuid,
  fanOnUuid,
  fanOffUuid,
  bleDeviceUuid,
  writeTemperatureUuid,
  currentTemperatureUuid,
  register1Uuid,
  register2Uuid,
  autoShutoffUuid,
  autoShutoffSettingUuid,
} from "../../constants/uuids";
import { useNavigate } from "react-router-dom";
import FanIcon from "./OutletRenderer/icons/FanIcon";
import BluetoothDisconnectIcon from "./OutletRenderer/icons/BluetoothDisconnectIcon";
import ControlsIcon from "./OutletRenderer/icons/ControlsIcon";
import MenuBarIcon from "./OutletRenderer/icons/MenuBarIcon";
// import PlusMinusButton from "../deviceInteraction/WriteTemperature/PlusMinusButton";
import {
  convertToUInt32BLE,
  convertToUInt8BLE,
  isValueInValidVolcanoCelciusRange,
  convertToFahrenheitFromCelsius,
  convertToCelsiusFromFahrenheit,
  convertCurrentTemperatureCharacteristicToCelcius,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../services/utils";
import { AddToPriorityQueue, AddToQueue, cancelCurrentWorkflow } from "../../services/bleQueueing";
import {
  setTargetTemperature,
  setCurrentTemperature,
} from "../deviceInteraction/deviceInteractionSlice";
import { setIsF, setAutoShutoffTime } from "../settings/settingsSlice";
import debounce from "lodash/debounce";
import { temperatureIncrementedDecrementedDebounceTime } from "../../constants/constants";
import { DEGREE_SYMBOL, MAX_CELSIUS_TEMP } from "../../constants/temperature";
import {
  heatingMask,
  fanMask,
  fahrenheitMask,
  celciusMask,
} from "../../constants/masks";
import store from "../../store";
import CurrentTemperature from "../deviceInteraction/CurrentTemperature/CurrentTemperature";
import CurrentTargetTemperature from "../deviceInteraction/CurrentTargetTemperature/CurrentTargetTemperature";
import { Range } from "react-range";
import { useTheme } from "styled-components";
import WorkflowItemTypes from "../../constants/enums";

const MinimalistWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(auto, 75px) 1fr 29%;
  grid-template-rows: 1fr;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  min-width: 300px;
  overflow: hidden;
  gap: 5px;
  padding: 5px;
  box-sizing: border-box;

  /* Global override for WriteTemperature Div width constraint */
  .temperature-write-div > div,
  & > * > * > div {
    width: 100% !important;
    max-width: none !important;
    flex: 1 !important;
    margin: 0 !important;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px 0 0 0;
  gap: 10px;
  justify-content: flex-start;
  width: 75px;
  max-width: 75px;
  align-items: center;
  height: calc(100vh - 10px);
  overflow-y: scroll;
  overflow-x: hidden;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.backgroundColor};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor};
    border-radius: 3px;
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.theme.buttonActive?.backgroundColor ||
      props.theme.primaryFontColor};
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor}
    ${(props) => props.theme.backgroundColor};
`;

const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 10px;
  padding: 0;
  height: calc(100vh - 10px); /* Explicit height minus wrapper padding */
  max-height: calc(100vh - 10px);
  box-sizing: border-box;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.backgroundColor};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor};
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.theme.buttonActive?.backgroundColor ||
      props.theme.primaryFontColor};
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor}
    ${(props) => props.theme.backgroundColor};

  /* Remove vertical padding from first and last elements */
  & > *:first-child {
    padding-top: 0;
    padding-bottom: 0;
  }

  & > *:last-child {
    padding-top: 0;
    padding-bottom: 0;
  }

  &.temperature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    grid-auto-rows: minmax(60px, 1fr);
    grid-template-rows: repeat(auto-fit, minmax(50px, 1fr));
    gap: 5px;
    align-content: stretch;
    align-items: stretch;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  padding: 2px 5px 0 5px;
  height: calc(100vh - 10px);
  max-height: calc(100vh - 10px);
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.backgroundColor};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor};
    border-radius: 3px;
    border: 1px solid ${(props) => props.theme.borderColor};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.theme.buttonActive?.backgroundColor ||
      props.theme.primaryFontColor};
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
      props.theme.buttonColorMain || props.theme.borderColor}
    ${(props) => props.theme.backgroundColor};
`;

const HeatFanSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  flex: 1 1 60px;
  min-height: 60px;
  z-index: 10;
  position: relative;
`;

const PlusMinusSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  flex: 1 1 60px;
  min-height: 60px;
  z-index: 5;
  position: relative;
`;

const LeftColumnTemperatureDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex: 0 0 auto;
  height: 80px;
  max-height: 80px;
`;

const ExitButton = styled(WriteTemperature)`
  flex: 0 0 24px;
  height: 24px;
  max-height: 24px;
  width: 24px;
  min-height: 24px;

  & > div {
    height: 24px !important;
    max-height: 24px !important;
    width: 24px !important;
    max-width: 24px !important;
  }

  button {
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.buttonColorMain},
      ${(props) => props.theme.buttonColorMain}cc
    ) !important;
    color: ${(props) => props.theme.primaryFontColor} !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding: 2px;
    font-size: 10px;
    height: 24px;
    max-height: 24px;
    width: 24px;
    max-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    &:hover {
      background: ${(props) =>
        props.theme.hoverBackgroundColor ||
        props.theme.buttonColorMain} !important;
    }

    &:focus,
    &:active {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      outline: none !important;
    }
  }
`;

const subtlePulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.85; }
  100% { opacity: 1; }
`;

const WorkflowButton = styled(WriteTemperature)`
  flex: 1 1 auto; /* Grow to fill space, can shrink, auto basis */
  min-height: 60px; /* Increased to accommodate word wrapping */
  ${props => props.isExpanded && css`
    min-height: auto;
  `}

  & > div {
    height: 100% !important;
  }
  
  /* Override any hover transforms from parent component */
  &:hover {
    transform: none !important;
  }
  
  & > div:hover {
    transform: none !important;
  }

  button {
    padding: 0;
    font-size: 16px;
    height: 100%;
    width: 100%;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.3;
    border-radius: 8px;
    display: flex;
    align-items: ${props => props.isExpanded ? 'flex-start' : 'center'};
    justify-content: ${props => props.isExpanded ? 'flex-start' : 'center'};
    cursor: ${props => props.isExpanded ? 'default' : 'pointer'};
    ${props => props.isActive && props.canExpand && css`
      animation: ${subtlePulse} 2s ease-in-out infinite;
      cursor: pointer !important;
    `}
    
    &:hover {
      transform: none !important;
      cursor: ${props => props.isExpanded ? 'default' : 'pointer'};
    }
  }
  
  /* Ensure no child elements have transforms on hover */
  * {
    &:hover {
      transform: none !important;
    }
  }

  /* Target PrideText spans inside buttons */
  span {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    display: block;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }

  /* Temperature grid styling */
  .temperature-grid & {
    flex: none;
    min-height: 60px;
    height: 100%;
    display: flex;
    align-items: stretch;

    & > div {
      height: 100% !important;
      display: flex !important;
      align-items: stretch !important;
    }

    button {
      padding: 0;
      font-size: 16px;
      border-radius: 8px;
      height: 100%;
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        transform: none !important;
      }
    }

    span {
      font-size: 16px;
      font-weight: 600;
    }
  }
`;

const HeatButton = styled(WriteTemperature)`
  width: 100%;
  height: 100%;
  min-height: 40px;

  & > div {
    height: 100% !important;
  }

  button {
    background: ${(props) =>
      props.isActive
        ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
        : `linear-gradient(145deg, ${props.theme.buttonColorMain}, ${props.theme.buttonColorMain}cc)`} !important;
    color: ${(props) =>
      props.isActive
        ? props.theme.buttonActive.color
        : props.theme.primaryFontColor} !important;
    border: 1px solid
      ${(props) =>
        props.isActive
          ? props.theme.buttonActive.borderColor
          : "rgba(255, 255, 255, 0.1)"} !important;
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .heat-icon {
      font-size: 24px;
      writing-mode: initial;
      text-orientation: initial;
      transform: none;
      line-height: 1;
    }

    &:hover {
      background: ${(props) =>
        props.isActive
          ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
          : `linear-gradient(145deg, ${
              props.theme.hoverBackgroundColor || props.theme.buttonColorMain
            }, ${
              props.theme.hoverBackgroundColor || props.theme.buttonColorMain
            }cc)`} !important;
      color: ${(props) =>
        props.isActive
          ? props.theme.buttonActive.color
          : props.theme.primaryFontColor} !important;
    }

    &:focus,
    &:active {
      background: ${(props) =>
        props.isActive
          ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
          : `linear-gradient(145deg, ${props.theme.buttonColorMain}, ${props.theme.buttonColorMain}cc)`} !important;
      color: ${(props) =>
        props.isActive
          ? props.theme.buttonActive.color
          : props.theme.primaryFontColor} !important;
      border: 1px solid
        ${(props) =>
          props.isActive
            ? props.theme.buttonActive.borderColor
            : "rgba(255, 255, 255, 0.1)"} !important;
      outline: none !important;
    }
  }
`;

const FanButton = styled(WriteTemperature)`
  width: 100%;
  height: 100%;
  min-height: 40px;

  & > div {
    height: 100% !important;
  }

  button {
    background: ${(props) =>
      props.isActive
        ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
        : `linear-gradient(145deg, ${props.theme.buttonColorMain}, ${props.theme.buttonColorMain}cc)`} !important;
    color: ${(props) =>
      props.isActive
        ? props.theme.buttonActive.color
        : props.theme.primaryFontColor} !important;
    border: 1px solid
      ${(props) =>
        props.isActive
          ? props.theme.buttonActive.borderColor
          : "rgba(255, 255, 255, 0.1)"} !important;
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    &:hover {
      background: ${(props) =>
        props.isActive
          ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
          : `linear-gradient(145deg, ${
              props.theme.hoverBackgroundColor || props.theme.buttonColorMain
            }, ${
              props.theme.hoverBackgroundColor || props.theme.buttonColorMain
            }cc)`} !important;
      color: ${(props) =>
        props.isActive
          ? props.theme.buttonActive.color
          : props.theme.primaryFontColor} !important;
    }

    &:focus,
    &:active {
      background: ${(props) =>
        props.isActive
          ? `linear-gradient(145deg, ${props.theme.buttonActive.backgroundColor}, ${props.theme.buttonActive.backgroundColor}cc)`
          : `linear-gradient(145deg, ${props.theme.buttonColorMain}, ${props.theme.buttonColorMain}cc)`} !important;
      color: ${(props) =>
        props.isActive
          ? props.theme.buttonActive.color
          : props.theme.primaryFontColor} !important;
      border: 1px solid
        ${(props) =>
          props.isActive
            ? props.theme.buttonActive.borderColor
            : "rgba(255, 255, 255, 0.1)"} !important;
      outline: none !important;
    }
  }
`;

const MinimalistPlusMinusButton = styled(WriteTemperature)`
  width: 100%;
  height: 100%;
  min-height: 40px;

  & > div {
    height: 100% !important;
  }

  button {
    background: linear-gradient(
      145deg,
      ${(props) =>
        props.theme.plusMinusButtons?.backgroundColor ||
        props.theme.buttonColorMain},
      ${(props) =>
        props.theme.plusMinusButtons?.backgroundColor ||
        props.theme.buttonColorMain}cc
    ) !important;
    color: ${(props) =>
      props.theme.plusMinusButtons?.color ||
      props.theme.primaryFontColor} !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    &:hover {
      background: ${(props) =>
        props.theme.hoverBackgroundColor ||
        props.theme.buttonColorMain} !important;
    }

    &:focus,
    &:active {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      outline: none !important;
    }
  }
`;

const HiddenWorkflowContainer = styled.div`
  display: none;
`;

const DisconnectButton = styled(WriteTemperature)`
  width: 100%;
  flex: 0 0 10%;
  max-height: 10%;
  min-height: 40px;

  & > div {
    height: 100% !important;
    width: 100% !important;
  }

  button {
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.buttonColorMain},
      ${(props) => props.theme.buttonColorMain}cc
    ) !important;
    color: ${(props) => props.theme.primaryFontColor} !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    &:hover {
      background: ${(props) =>
        props.theme.hoverBackgroundColor ||
        props.theme.buttonColorMain} !important;
    }

    &:focus,
    &:active {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      outline: none !important;
    }
  }
`;

const ControlsButton = styled(WriteTemperature)`
  width: 100%;
  flex: 0 0 10%;
  max-height: 10%;
  min-height: 40px;

  & > div {
    height: 100% !important;
    width: 100% !important;
  }

  button {
    background: linear-gradient(
      145deg,
      ${(props) => props.theme.buttonColorMain},
      ${(props) => props.theme.buttonColorMain}cc
    ) !important;
    color: ${(props) => props.theme.primaryFontColor} !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    &:hover {
      background: ${(props) =>
        props.theme.hoverBackgroundColor ||
        props.theme.buttonColorMain} !important;
    }

    &:focus,
    &:active {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      outline: none !important;
    }
  }
`;

const NavigationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`;

const NavigationMenu = styled.div`
  background: ${props => props.theme.backgroundColor};
  border-radius: 20px;
  padding: 28px;
  max-width: 380px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.15)'};
  backdrop-filter: blur(15px);
  gap: 8px;
  display: flex;
  flex-direction: column;
`;

const NavigationItem = styled(StyledRouterIconLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  margin: 6px 0;
  border-radius: 14px;
  background: ${props => props.theme.buttonColorMain};
  color: ${props => props.theme.primaryFontColor};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 17px;
  font-weight: 500;
  min-height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:first-child {
    margin-top: 8px;
  }
  
  &:last-child {
    margin-bottom: 8px;
  }
  
  &:hover {
    background: ${props => props.theme.hoverBackgroundColor || props.theme.buttonColorMain};
    transform: translateX(-8px) scale(1.03);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateX(-6px) scale(0.98);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    width: 26px;
    height: 26px;
    margin-left: 16px;
    flex-shrink: 0;
    opacity: 0.9;
  }
  
  span {
    flex: 1;
    text-align: left;
    line-height: 1.3;
  }
`;

const AutoOffCircleContainer = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  margin-left: -9px;
  opacity: ${(props) => (props.isActive ? 1 : 0.3725)};
  transition: all 0.75s;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: ${(props) => props.theme.iconColor};
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke: ${(props) => props.theme.backgroundColor};
    stroke-width: 2.8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.75s ease;
  }

  .percentage {
    font-size: 0.675em;
    text-anchor: middle;
    dominant-baseline: middle;
    fill: ${(props) => props.theme.iconColor};
  }
`;

const TemperatureRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & > div {
    font-size: 1.5rem !important;
    margin-bottom: 0 !important;

    div {
      font-size: 1.5rem !important;
    }

    span {
      font-size: 1rem !important;
    }
  }
`;

const VerticalRangeContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 200px;
  touch-action: none; /* Prevent scroll on mobile when dragging */
  user-select: none; /* Prevent text selection on drag */
  z-index: 1;
  position: relative;
`;

const WorkflowDetailsCard = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px;
  margin: 0;
  box-shadow: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: ${props => props.theme.primaryFontColor};
`;

const WorkflowDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
  font-size: 0.85rem;
`;

const WorkflowDetailLabel = styled.span`
  font-weight: 500;
`;

const WorkflowDetailValue = styled.span`
  font-weight: 600;
`;

const WorkflowActionButton = styled.button`
  background: linear-gradient(
    145deg,
    ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.1)'},
    ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.1)'}cc
  );
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.2)'};
  color: inherit;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer !important;
  transition: all 0.2s ease;
  margin: 2px;
  flex-shrink: 0;
  
  &:hover {
    background: linear-gradient(
      145deg,
      ${props => props.theme.hoverBackgroundColor || props.theme.buttonColorMain},
      ${props => props.theme.hoverBackgroundColor || props.theme.buttonColorMain}cc
    );
    transform: scale(1.02);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

export default function MinimalistLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workflows = useSelector(
    (state) => state.settings.config.workflows.items
  );
  const currentWorkflow = useSelector(
    (state) => state.workflow?.currentWorkflow
  );
  const executingWorkflow = useSelector((state) => state.workflow || {});
  const lastWorkflowRunId = useSelector(
    (state) => state.workflow?.lastWorkflowRunId
  );
  const highlightLastRunWorkflow = useSelector(
    (state) => state.settings.config.highlightLastRunWorkflow
  );
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );
  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  const isF = useSelector((state) => state.settings.isF);
  const autoOffTimeInSeconds = useSelector(
    (state) => state.deviceInformation.autoOffTimeInSeconds
  );
  const autoShutoffTimeSetting = useSelector(
    (state) => state.settings.autoShutoffTime
  );
  const currentTimeInSeconds = useSelector(
    (state) => state.workflow.currentStepEllapsedTimeInSeconds || 0
  );
  const fanOnGlobalValue = useSelector(
    (state) => state.settings.config.workflows.fanOnGlobal || 0
  );
  const workflowRef = useRef(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [expandedWorkflowIndex, setExpandedWorkflowIndex] = useState(null);
  const theme = useTheme();

  // Current temperature BLE handler
  useEffect(() => {
    const BlePayload = async () => {
      try {
        const characteristic = getCharacteristic(currentTemperatureUuid);
        if (!characteristic) {
          console.warn(
            "Current temperature characteristic not found in minimalist mode"
          );
          return;
        }

        const onCharacteristicChange = (event) => {
          const currentTemperature =
            convertCurrentTemperatureCharacteristicToCelcius(
              event.target.value
            );
          if (
            store.getState().deviceInteraction.currentTemperature !==
            currentTemperature
          ) {
            dispatch(setCurrentTemperature(currentTemperature));
          }
        };

        await characteristic.addEventListener(
          "characteristicvaluechanged",
          onCharacteristicChange
        );
        await characteristic.startNotifications();
        const value = await characteristic.readValue();
        const normalizedValue =
          convertCurrentTemperatureCharacteristicToCelcius(value);

        if (
          store.getState().deviceInteraction.currentTemperature !==
          normalizedValue
        ) {
          dispatch(setCurrentTemperature(normalizedValue));
        }

        // Store cleanup function
        return async () => {
          await characteristic?.removeEventListener(
            "characteristicvaluechanged",
            onCharacteristicChange
          );
        };
      } catch (error) {
        console.error(
          "Error setting up current temperature BLE handler in minimalist mode:",
          error
        );
        navigate("/");
      }
    };

    AddToQueue(BlePayload);
  }, [dispatch, navigate]);

  // Target temperature BLE handler
  useEffect(() => {
    const blePayload = async () => {
      try {
        const characteristic = getCharacteristic(writeTemperatureUuid);
        if (!characteristic) {
          console.warn(
            "Target temperature characteristic not found in minimalist mode"
          );
          return;
        }

        const handleTargetTemperatureChanged = (event) => {
          const targetTemperature =
            convertCurrentTemperatureCharacteristicToCelcius(
              event.target.value
            );
          if (
            store.getState().deviceInteraction.targetTemperature !==
            targetTemperature
          ) {
            dispatch(setTargetTemperature(targetTemperature));
          }
        };

        await characteristic.addEventListener(
          "characteristicvaluechanged",
          handleTargetTemperatureChanged
        );

        await characteristic.startNotifications();
        const value = await characteristic.readValue();
        const targetTemperature =
          convertCurrentTemperatureCharacteristicToCelcius(value);
        if (
          store.getState().deviceInteraction.targetTemperature !==
          targetTemperature
        ) {
          dispatch(setTargetTemperature(targetTemperature));
        }

        // Store cleanup function
        return async () => {
          await characteristic?.removeEventListener(
            "characteristicvaluechanged",
            handleTargetTemperatureChanged
          );
        };
      } catch (error) {
        console.error(
          "Error setting up target temperature BLE handler in minimalist mode:",
          error
        );
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  }, [dispatch, navigate]);

  // Visibility change handlers for both temperatures
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          // Current temperature
          const currentTempPayload = async () => {
            try {
              const characteristic = getCharacteristic(currentTemperatureUuid);
              if (!characteristic) return;
              const value = await characteristic.readValue();
              const normalizedValue =
                convertCurrentTemperatureCharacteristicToCelcius(value);
              if (
                store.getState().deviceInteraction.currentTemperature !==
                normalizedValue
              ) {
                dispatch(setCurrentTemperature(normalizedValue));
              }
            } catch (error) {
              console.error(
                "Error reading current temperature on visibility change:",
                error
              );
              navigate("/");
            }
          };
          AddToQueue(currentTempPayload);

          // Target temperature
          const targetTempPayload = async () => {
            try {
              const characteristic = getCharacteristic(writeTemperatureUuid);
              if (!characteristic) return;
              const value = await characteristic.readValue();
              const targetTemperature =
                convertCurrentTemperatureCharacteristicToCelcius(value);
              if (
                store.getState().deviceInteraction.targetTemperature !==
                targetTemperature
              ) {
                dispatch(setTargetTemperature(targetTemperature));
              }
            } catch (error) {
              console.error(
                "Error reading target temperature on visibility change:",
                error
              );
              navigate("/");
            }
          };
          AddToQueue(targetTempPayload);
        }, 250);
      }
    };

    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, [dispatch, navigate]);

  // Heat and Fan status BLE handler (register1Uuid)
  useEffect(() => {
    const blePayload = async () => {
      try {
        const characteristic = getCharacteristic(register1Uuid);
        if (!characteristic) {
          console.warn("Register1 characteristic not found in minimalist mode");
          return;
        }

        const onRegister1Change = (event) => {
          const currentVal = convertBLEtoUint16(event.target.value);
          const newHeatValue = convertToggleCharacteristicToBool(
            currentVal,
            heatingMask
          );
          const newFanValue = convertToggleCharacteristicToBool(
            currentVal,
            fanMask
          );

          if (store.getState().deviceInteraction.isHeatOn !== newHeatValue) {
            dispatch(setIsHeatOn(newHeatValue));
          }
          if (store.getState().deviceInteraction.isFanOn !== newFanValue) {
            dispatch(setIsFanOn(newFanValue));
          }
        };

        await characteristic.addEventListener(
          "characteristicvaluechanged",
          onRegister1Change
        );
        await characteristic.startNotifications();

        // Initial read
        const value = await characteristic.readValue();
        const currentVal = convertBLEtoUint16(value);
        const newHeatValue = convertToggleCharacteristicToBool(
          currentVal,
          heatingMask
        );
        const newFanValue = convertToggleCharacteristicToBool(
          currentVal,
          fanMask
        );

        if (store.getState().deviceInteraction.isHeatOn !== newHeatValue) {
          dispatch(setIsHeatOn(newHeatValue));
        }
        if (store.getState().deviceInteraction.isFanOn !== newFanValue) {
          dispatch(setIsFanOn(newFanValue));
        }

        // Store cleanup function
        return async () => {
          await characteristic?.removeEventListener(
            "characteristicvaluechanged",
            onRegister1Change
          );
        };
      } catch (error) {
        console.error(
          "Error setting up heat/fan status BLE handler in minimalist mode:",
          error
        );
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  }, [dispatch, navigate]);

  // Temperature unit (Celsius/Fahrenheit) BLE handler (register2Uuid)
  useEffect(() => {
    const blePayload = async () => {
      try {
        const characteristic = getCharacteristic(register2Uuid);
        if (!characteristic) {
          console.warn("Register2 characteristic not found in minimalist mode");
          return;
        }

        const onRegister2Change = (event) => {
          const convertedValue = convertBLEtoUint16(event.target.value);
          const isFValue = convertToggleCharacteristicToBool(
            convertedValue,
            fahrenheitMask
          );

          if (store.getState().settings.isF !== isFValue) {
            dispatch(setIsF(isFValue));
          }
        };

        await characteristic.addEventListener(
          "characteristicvaluechanged",
          onRegister2Change
        );
        await characteristic.startNotifications();

        // Initial read
        const value = await characteristic.readValue();
        const convertedValue = convertBLEtoUint16(value);
        const isFValue = convertToggleCharacteristicToBool(
          convertedValue,
          fahrenheitMask
        );

        if (store.getState().settings.isF !== isFValue) {
          dispatch(setIsF(isFValue));
        }

        // Store cleanup function
        return async () => {
          await characteristic?.removeEventListener(
            "characteristicvaluechanged",
            onRegister2Change
          );
        };
      } catch (error) {
        console.error(
          "Error setting up temperature unit BLE handler in minimalist mode:",
          error
        );
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  }, [dispatch, navigate]);

  // Auto-shutoff monitoring
  useEffect(() => {
    const intervalFunction = () => {
      const blePayload = async () => {
        if (!isHeatOn) {
          return;
        }

        try {
          const characteristic = getCharacteristic(autoShutoffUuid);
          if (!characteristic) return;
          const value = await characteristic.readValue();
          const actualValue = convertBLEtoUint16(value);
          dispatch(setAutoOffTimeInSeconds(actualValue));
        } catch (error) {
          console.error("Error reading auto-shutoff time:", error);
        }
      };

      const blePayload2 = async () => {
        try {
          const characteristic = getCharacteristic(autoShutoffSettingUuid);
          if (!characteristic) return;
          const value = await characteristic.readValue();
          const normalizedValue = convertBLEtoUint16(value) / 60;
          dispatch(setAutoShutoffTime(normalizedValue));
        } catch (error) {
          console.error("Error reading auto-shutoff setting:", error);
        }
      };

      AddToQueue(blePayload);
      AddToQueue(blePayload2);
    };

    intervalFunction();
    const interval = setInterval(() => {
      if (isHeatOn) {
        intervalFunction();
      }
    }, 15000); // Update every 15 seconds

    if (!isHeatOn) {
      dispatch(setAutoOffTimeInSeconds(0));
    }

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, isHeatOn]);


  // Auto-expand executing workflow and close when it completes
  useEffect(() => {
    if (currentWorkflow) {
      // Find the index of the executing workflow and auto-expand it
      const executingIndex = workflows.findIndex(w => w.id === currentWorkflow.id);
      if (executingIndex !== -1) {
        setExpandedWorkflowIndex(executingIndex);
      }
    } else {
      setExpandedWorkflowIndex(null);
    }
  }, [currentWorkflow, workflows]);

  // Temperature increment/decrement functionality (copied from WriteTemperatureContainer)
  const onTemperatureIncrementDecrementDebounceRef = useRef(
    debounce((newTemp, disableAutoHeatOn) => {
      onTemperatureClick(newTemp, disableAutoHeatOn)();
    }, temperatureIncrementedDecrementedDebounceTime)
  );

  const onTemperatureClick = (value, disableAutoHeatOn) => () => {
    if (!isValueInValidVolcanoCelciusRange(value)) {
      return;
    }

    const blePayload = async () => {
      try {
        let characteristic, buffer;

        if (targetTemperature !== value) {
          characteristic = getCharacteristic(writeTemperatureUuid);
          if (!characteristic) {
            console.error(
              "Temperature characteristic not found - redirecting to home"
            );
            navigate("/");
            return;
          }
          buffer = convertToUInt32BLE(value * 10);
          await characteristic.writeValue(buffer);
          dispatch(setTargetTemperature(value));
        }

        if (!isHeatOn && !disableAutoHeatOn) {
          characteristic = getCharacteristic(heatOnUuid);
          if (!characteristic) {
            console.error(
              "Heat characteristic not found - redirecting to home"
            );
            navigate("/");
            return;
          }
          buffer = convertToUInt8BLE(0);
          await characteristic.writeValue(buffer);
          dispatch(setIsHeatOn(true));
        }
      } catch (error) {
        console.error("Error setting temperature in minimalist mode:", error);
        navigate("/");
      }
    };
    AddToPriorityQueue(blePayload);
  };

  const onTemperatureIncrement = (incrementValue) => () => {
    if (!isHeatOn) {
      const blePayload = async () => {
        try {
          let characteristic, buffer;
          characteristic = getCharacteristic(heatOnUuid);
          if (!characteristic) {
            console.error(
              "Heat characteristic not found - redirecting to home"
            );
            navigate("/");
            return;
          }
          buffer = convertToUInt8BLE(0);
          await characteristic.writeValue(buffer);
          dispatch(setIsHeatOn(true));
        } catch (error) {
          console.error("Error turning on heat in minimalist mode:", error);
          navigate("/");
        }
      };
      AddToPriorityQueue(blePayload);
    }
    const nextTemp = targetTemperature + incrementValue;
    if (!isValueInValidVolcanoCelciusRange(nextTemp)) {
      return;
    }
    dispatch(setTargetTemperature(nextTemp));
    onTemperatureIncrementDecrementDebounceRef.current(nextTemp, true);
  };

  // Vertical temperature range functionality
  const MIN_CELSIUS_TEMP = 170;
  const sliderDisplayValue = Math.max(
    MIN_CELSIUS_TEMP,
    Math.min(MAX_CELSIUS_TEMP, targetTemperature || MIN_CELSIUS_TEMP)
  );

  const onRangeMouseUp = (e) => {
    if (!e || !e[0] || !isValueInValidVolcanoCelciusRange(e[0])) {
      console.warn("Invalid temperature value for range:", e);
      return;
    }

    const blePayload = async () => {
      try {
        const characteristic = getCharacteristic(writeTemperatureUuid);
        if (!characteristic) {
          console.error(
            "Temperature characteristic not found - redirecting to home"
          );
          navigate("/");
          return;
        }
        const buffer = convertToUInt32BLE(e[0] * 10);
        await characteristic.writeValue(buffer);
      } catch (error) {
        console.error(
          "Error setting temperature range in minimalist mode:",
          error
        );
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  };

  const onRangeChange = (e) => {
    if (!e || !e[0] || !isValueInValidVolcanoCelciusRange(e[0])) {
      console.warn("Invalid temperature value for range change:", e);
      return;
    }

    if (!isHeatOn) {
      const blePayload = async () => {
        try {
          const characteristic = getCharacteristic(heatOnUuid);
          if (!characteristic) {
            console.error(
              "Heat characteristic not found - redirecting to home"
            );
            navigate("/");
            return;
          }
          const buffer = convertToUInt8BLE(0);
          await characteristic.writeValue(buffer);
          dispatch(setIsHeatOn(true));
        } catch (error) {
          console.error("Error turning on heat in minimalist mode:", error);
          navigate("/");
        }
      };
      AddToPriorityQueue(blePayload);
    }
    dispatch(setTargetTemperature(e[0]));
  };

  const handleNavigationToggle = () => {
    setShowNavigation(!showNavigation);
  };

  const handleNavigationItemClick = (action) => {
    setShowNavigation(false);
    dispatch(setIsMinimalistMode(false));
    if (action) action();
  };

  const handleWorkflowClick = (index) => {
    try {
      const workflow = workflows[index];
      const isActive = currentWorkflow?.id === workflow.id;

      if (isActive) {
        // Toggle expanded state for active workflow
        setExpandedWorkflowIndex(expandedWorkflowIndex === index ? null : index);
      } else {
        // Click the corresponding button in the hidden WorkFlow component
        if (!workflowRef.current) {
          console.error('Workflow ref not available');
          return;
        }
        const buttons = workflowRef.current?.querySelectorAll(
          ".temperature-write-div button"
        );
        console.log('Found buttons:', buttons?.length);
        if (buttons && buttons[index]) {
          buttons[index].click();
        } else {
          console.error('Button not found at index:', index);
        }
      }
    } catch (error) {
      console.error('Error in handleWorkflowClick:', error);
    }
  };

  const handleHeatClick = () => {
    const blePayload = async () => {
      try {
        const uuid = isHeatOn ? heatOffUuid : heatOnUuid;
        const characteristic = getCharacteristic(uuid);
        if (!characteristic) {
          console.error("Heat characteristic not found - redirecting to home");
          navigate("/");
          return;
        }
        const buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
        dispatch(setIsHeatOn(!isHeatOn));
      } catch (error) {
        console.error("Error controlling heat in minimalist mode:", error);
        navigate("/");
      }
    };
    AddToPriorityQueue(blePayload);
  };

  const handleFanClick = useCallback(() => {
    const blePayload = async () => {
      try {
        const uuid = isFanOn ? fanOffUuid : fanOnUuid;
        const characteristic = getCharacteristic(uuid);
        if (!characteristic) {
          console.error("Fan characteristic not found - redirecting to home");
          navigate("/");
          return;
        }
        const buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
        dispatch(setIsFanOn(!isFanOn));
      } catch (error) {
        console.error("Error controlling fan in minimalist mode:", error);
        navigate("/");
      }
    };
    AddToPriorityQueue(blePayload);
  }, [isFanOn, navigate, dispatch]);

  // Spacebar fan toggle functionality
  useEffect(() => {
    const spaceBarKeycode = 32;
    const handler = (e) => {
      if (e.keyCode === spaceBarKeycode) {
        handleFanClick();
      }
    };
    document.addEventListener("keyup", handler);

    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, [handleFanClick]);

  const handleDisconnect = async () => {
    try {
      const bleDevice = getCharacteristic(bleDeviceUuid);
      if (bleDevice && bleDevice.gatt) {
        await bleDevice.gatt.disconnect();
      }
    } catch (error) {
      console.warn("Error disconnecting BLE device:", error);
    }
    clearCache();
    navigate("/");
  };

  const handleTemperatureUnitToggle = () => {
    const blePayload = async () => {
      try {
        const characteristicPrj2V = getCharacteristic(register2Uuid);
        if (!characteristicPrj2V) {
          console.error(
            "Register2 characteristic not found - redirecting to home"
          );
          navigate("/");
          return;
        }

        const mask = isF ? celciusMask : fahrenheitMask;
        const buffer = convertToUInt32BLE(mask);
        await characteristicPrj2V.writeValue(buffer);
        dispatch(setIsF(!isF));
      } catch (error) {
        console.error(
          "Error toggling temperature units in minimalist mode:",
          error
        );
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  };

  // Calculate temperature values and suffix for display
  const temperatureSuffix = `${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
  const displayCurrentTemperature =
    currentTemperature && !isNaN(parseInt(currentTemperature))
      ? isF
        ? Math.round(convertToFahrenheitFromCelsius(currentTemperature))
        : Math.round(currentTemperature)
      : currentTemperature;
  const displayTargetTemperature =
    targetTemperature && !isNaN(parseInt(targetTemperature))
      ? isF
        ? Math.round(convertToFahrenheitFromCelsius(targetTemperature))
        : Math.round(targetTemperature)
      : targetTemperature;

  return (
    <MinimalistWrapper className="minimalist-mode">
      <LeftColumn>
        <AutoOffCircleContainer isActive={isHeatOn}>
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray="100, 100"
              strokeDashoffset={
                isHeatOn &&
                autoOffTimeInSeconds > 0 &&
                autoShutoffTimeSetting > 0
                  ? (autoOffTimeInSeconds / 60 / autoShutoffTimeSetting) *
                    100 *
                    -1
                  : isHeatOn
                  ? -100
                  : 0
              }
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="19" className="percentage">
              {isHeatOn &&
                ((autoOffTimeInSeconds > 60 &&
                  Math.round(autoOffTimeInSeconds / 60)) ||
                  (autoOffTimeInSeconds > 0 && "< 1") ||
                  autoShutoffTimeSetting)}
            </text>
          </svg>
        </AutoOffCircleContainer>

        <LeftColumnTemperatureDisplay>
          <TemperatureRow
            onClick={handleTemperatureUnitToggle}
            style={{ cursor: "pointer" }}
          >
            <CurrentTemperature
              currentTemperature={displayCurrentTemperature}
              temperatureSuffix={temperatureSuffix}
            />
          </TemperatureRow>
          <TemperatureRow
            onClick={handleTemperatureUnitToggle}
            style={{
              opacity: isHeatOn ? "1" : "0",
              transition: "all 0.35s",
              filter: "grayscale(1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <CurrentTargetTemperature
              currentTargetTemperature={displayTargetTemperature}
              temperatureSuffix={temperatureSuffix}
            />
          </TemperatureRow>
        </LeftColumnTemperatureDisplay>
        <VerticalRangeContainer>
          <Range
            step={1}
            min={MIN_CELSIUS_TEMP}
            max={MAX_CELSIUS_TEMP}
            values={[sliderDisplayValue]}
            onChange={(values) => onRangeChange(values)}
            onFinalChange={onRangeMouseUp}
            direction="to top"
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "32px !important",
                  minWidth: "32px",
                  maxWidth: "32px",
                  minHeight: "200px",
                  borderRadius: ".25rem",
                  backgroundColor: "#f53803",
                  backgroundImage:
                    theme?.temperatureRange?.backgroundVertical ||
                    "linear-gradient(to top, #f5d020, #f53803)",
                  opacity: 1,
                  touchAction: "none",
                }}
                onTouchStart={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  aria-valuenow={
                    isF && targetTemperature
                      ? Math.round(
                          convertToFahrenheitFromCelsius(targetTemperature)
                        )
                      : targetTemperature || MIN_CELSIUS_TEMP
                  }
                  style={{
                    ...restProps.style,
                    height: "64px",
                    width: "64px",
                    backgroundColor:
                      theme?.temperatureRange?.rangeBoxColor || "#ffffff",
                    borderColor:
                      theme?.temperatureRange?.rangeBoxBorderColor || "#f53803",
                    borderStyle: "solid",
                    borderWidth:
                      theme?.temperatureRange?.rangeBoxBorderWidth || "2px",
                    borderRadius:
                      theme?.temperatureRange?.rangeBoxBorderRadius || "50%",
                    background:
                      theme?.temperatureRange?.rangeBackground ||
                      theme?.temperatureRange?.rangeBoxColor ||
                      "#ffffff",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                    touchAction: "none",
                  }}
                  onTouchStart={(e) => e.preventDefault()}
                  onTouchMove={(e) => e.preventDefault()}
                />
              );
            }}
          />
        </VerticalRangeContainer>
      </LeftColumn>

      <MiddleColumn
        className={workflows.length === 0 ? "temperature-grid" : ""}
      >
        {workflows.length > 0
          ? workflows.map((item, index) => {
              const isActive = currentWorkflow?.id === item.id;
              const isLastRunWorkflow =
                item.id === lastWorkflowRunId && !isActive;
              const isExpanded = expandedWorkflowIndex === index && isActive;
              const buttonText = item.name;

              return (
                <WorkflowButton
                  key={index}
                  onClick={() => handleWorkflowClick(index)}
                  buttonText={isExpanded && currentWorkflow ? (
                    <WorkflowDetailsCard onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        try {
                          // Get current workflow step info
                          const currentStepId = executingWorkflow?.currentWorkflowStepId || "";
                          if (!currentStepId || !currentWorkflow.payload) return (
                            <div style={{ textAlign: 'center' }}>
                              <div>Loading</div>
                              <div>Please wait</div>
                            </div>
                          );
                          
                          const currentStep = currentWorkflow.payload[currentStepId - 1];
                          if (!currentStep) return (
                            <div style={{ textAlign: 'center' }}>
                              <div>Loading step</div>
                              <div>Please wait</div>
                            </div>
                          );
                          
                          const stepType = currentStep?.type;
                          const payload = currentStep?.payload;
                      
                      // Get step display name
                      let stepDisplayName = "N/A";
                      switch (stepType) {
                        case WorkflowItemTypes.FAN_ON:
                          stepDisplayName = "Fan On";
                          break;
                        case WorkflowItemTypes.FAN_ON_GLOBAL:
                          stepDisplayName = "Fan On (Global)";
                          break;
                        case WorkflowItemTypes.HEAT_OFF:
                          stepDisplayName = "Turning Heat Off";
                          break;
                        case WorkflowItemTypes.HEAT_ON:
                          if (payload && payload > 0) {
                            stepDisplayName = `Heating to ${
                              isF
                                ? `${convertToFahrenheitFromCelsius(payload)}${DEGREE_SYMBOL}F`
                                : `${payload}${DEGREE_SYMBOL}C`
                            }`;
                          } else {
                            stepDisplayName = "Heat On";
                          }
                          break;
                        case WorkflowItemTypes.SET_LED_BRIGHTNESS:
                          stepDisplayName = `Set LED Brightness to ${payload}`;
                          break;
                        case WorkflowItemTypes.WAIT:
                          stepDisplayName = "Waiting";
                          break;
                        case WorkflowItemTypes.HEAT_ON_WITH_CONDITIONS:
                          try {
                            if (payload && payload.conditions && Array.isArray(payload.conditions)) {
                              const heatStep = payload.conditions.find(
                                (x) => x.nextTemp === targetTemperature
                              );

                              if (heatStep) {
                                const nextHeat = isF
                                  ? convertToFahrenheitFromCelsius(heatStep.nextTemp)
                                  : heatStep.nextTemp;

                                // Check if we've reached target temp and are now waiting
                                const currentTempC = isF
                                  ? convertToCelsiusFromFahrenheit(currentTemperature)
                                  : currentTemperature;
                                const targetTempC = heatStep.nextTemp;

                                if (currentTempC >= targetTempC && heatStep.wait > 0) {
                                  stepDisplayName = `Waiting at ${nextHeat}°${isF ? "F" : "C"}`;
                                } else {
                                  stepDisplayName = `Heating to ${nextHeat}°${isF ? "F" : "C"}`;
                                }
                              } else if (payload.default && payload.default.temp) {
                                const defaultTemp = isF
                                  ? convertToFahrenheitFromCelsius(payload.default.temp)
                                  : payload.default.temp;

                                // Check if we've reached default temp and are waiting
                                const currentTempC = isF
                                  ? convertToCelsiusFromFahrenheit(currentTemperature)
                                  : currentTemperature;
                                const targetTempC = payload.default.temp;

                                if (currentTempC >= targetTempC && payload.default.wait > 0) {
                                  stepDisplayName = `Waiting at ${defaultTemp}°${isF ? "F" : "C"}`;
                                } else {
                                  stepDisplayName = `Heating to ${defaultTemp}°${isF ? "F" : "C"}`;
                                }
                              } else {
                                stepDisplayName = "Conditional Heat";
                              }
                            } else {
                              stepDisplayName = "Conditional Heat";
                            }
                          } catch (error) {
                            console.error('Error in conditional heat logic:', error);
                            stepDisplayName = "Conditional Heat";
                          }
                          break;
                        case WorkflowItemTypes.LOOP_FROM_BEGINNING:
                          stepDisplayName = "Looping to Start";
                          break;
                        case WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS:
                          stepDisplayName = "Checking Exit Condition";
                          break;
                        default:
                          stepDisplayName = "Processing...";
                      }
                      
                      const totalSteps = currentWorkflow.payload.filter(
                        (item) =>
                          ![
                            WorkflowItemTypes.LOOP_FROM_BEGINNING,
                            WorkflowItemTypes.EXIT_WORKFLOW_WHEN_TARGET_TEMPERATURE_IS,
                          ].includes(item.type)
                      ).length;
                      
                      return (
                        <>
                          <WorkflowActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelCurrentWorkflow();
                              setExpandedWorkflowIndex(null);
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              margin: 0,
                              width: 'auto',
                              height: 'auto'
                            }}
                          >
                            <PrideText text="Cancel" />
                          </WorkflowActionButton>
                          
                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                              <PrideText text={`${currentStepId}/${totalSteps} ${stepDisplayName}`} />
                            </div>
                            
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem'
                            }}>
                              <span style={{ 
                              fontFamily: 'digital-mono, monospace',
                              fontSize: '1rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              color: (() => {
                                // Determine if we have a countdown
                                let stepDurationSeconds = null;
                                if (stepType === WorkflowItemTypes.FAN_ON) {
                                  stepDurationSeconds = payload;
                                } else if (stepType === WorkflowItemTypes.FAN_ON_GLOBAL) {
                                  stepDurationSeconds = fanOnGlobalValue;
                                } else if (stepType === WorkflowItemTypes.WAIT) {
                                  stepDurationSeconds = payload;
                                }
                                
                                const hasCountdown = stepDurationSeconds !== null && stepDurationSeconds > 0;
                                if (!hasCountdown) return 'inherit';
                                
                                const timeRemaining = Math.max(0, stepDurationSeconds - currentTimeInSeconds);
                                
                                // Apply countdown colors
                                if (timeRemaining <= 5 && timeRemaining > 3) {
                                  return '#ff9500';
                                } else if (timeRemaining <= 3 && timeRemaining > 1) {
                                  return '#ff6b35';
                                } else if (timeRemaining <= 1) {
                                  return '#ff0000';
                                }
                                return 'inherit';
                              })()
                            }}>
                              <PrideText text={(() => {
                                // Determine if we have a countdown
                                let stepDurationSeconds = null;
                                if (stepType === WorkflowItemTypes.FAN_ON) {
                                  stepDurationSeconds = payload;
                                } else if (stepType === WorkflowItemTypes.FAN_ON_GLOBAL) {
                                  stepDurationSeconds = fanOnGlobalValue;
                                } else if (stepType === WorkflowItemTypes.WAIT) {
                                  stepDurationSeconds = payload;
                                }
                                
                                const hasCountdown = stepDurationSeconds !== null && stepDurationSeconds > 0;
                                
                                if (hasCountdown) {
                                  // Show countdown with decimals for fan operations
                                  const timeRemaining = Math.max(0, stepDurationSeconds - currentTimeInSeconds);
                                  const mins = Math.floor(timeRemaining / 60);
                                  const wholeSecs = Math.floor(timeRemaining % 60);
                                  const decimals = Math.floor((timeRemaining % 1) * 10);
                                  
                                  if (stepType === WorkflowItemTypes.FAN_ON || stepType === WorkflowItemTypes.FAN_ON_GLOBAL) {
                                    // Fan operations: show decimals "0:05.3"
                                    return `${mins.toString().padStart(2, "0")}:${wholeSecs
                                      .toString()
                                      .padStart(2, "0")}.${decimals}`;
                                  } else {
                                    // Wait operations: no decimals "0:05"
                                    return `${mins.toString().padStart(2, "0")}:${wholeSecs
                                      .toString()
                                      .padStart(2, "0")}`;
                                  }
                                } else {
                                  // Show elapsed time for non-timed steps
                                  const mins = Math.floor(currentTimeInSeconds / 60);
                                  const secs = Math.floor(currentTimeInSeconds % 60);
                                  return `${mins.toString().padStart(2, "0")}:${secs
                                    .toString()
                                    .padStart(2, "0")}`;
                                }
                              })()} />
                            </span>
                          </div>
                        </div>
                        </>
                      );
                      } catch (error) {
                        console.error('Error rendering workflow details:', error);
                        return <div>Error loading workflow details</div>;
                      }
                    })()}
                  </WorkflowDetailsCard>
                ) : (
                  <PrideText text={buttonText} />
                )}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  canExpand={isActive && !isExpanded}
                  isGlowy={highlightLastRunWorkflow && isLastRunWorkflow}
                  totalItems={workflows.length}
                />
              );
            })
          : // Temperature grid when no workflows exist (170°C to 230°C in 5°C increments)
            Array.from({ length: 12 }, (_, i) => 175 + i * 5).map((temp) => {
              const displayTemp = isF
                ? Math.round(convertToFahrenheitFromCelsius(temp))
                : temp;
              const isActive = targetTemperature === temp;

              return (
                <WorkflowButton
                  key={temp}
                  onClick={() => onTemperatureClick(temp, false)()}
                  buttonText={
                    <PrideText text={`${displayTemp}${temperatureSuffix}`} />
                  }
                  isActive={isActive}
                />
              );
            })}
      </MiddleColumn>

      <RightColumn>
        <HeatFanSection>
          <HeatButton
            onClick={handleHeatClick}
            buttonText={<span className="heat-icon">🔥</span>}
            isActive={isHeatOn}
          />
          <FanButton
            onClick={handleFanClick}
            buttonText={<FanIcon size="24px" />}
            isActive={isFanOn}
          />
        </HeatFanSection>

        <PlusMinusSection>
          <MinimalistPlusMinusButton
            aria-label="Decrease temperature"
            onClick={onTemperatureIncrement(-1)}
            buttonText={
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="minus"
                className="svg-inline--fa fa-minus fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                ></path>
              </svg>
            }
          />
          <MinimalistPlusMinusButton
            aria-label="Increase temperature"
            onClick={onTemperatureIncrement(1)}
            buttonText={
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="plus"
                className="svg-inline--fa fa-plus fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                ></path>
              </svg>
            }
          />
        </PlusMinusSection>

        <ControlsButton
          onClick={handleNavigationToggle}
          buttonText={<MenuBarIcon />}
        />
      </RightColumn>

      <HiddenWorkflowContainer ref={workflowRef}>
        <WorkFlow />
      </HiddenWorkflowContainer>

      {/* Hidden timer component - needed for timer logic */}
      <div style={{ display: "none" }}>
        <CurrentWorkflowExecutionDisplay />
      </div>
      
      {/* Navigation Overlay */}
      <NavigationOverlay isVisible={showNavigation} onClick={() => setShowNavigation(false)}>
        <NavigationMenu onClick={(e) => e.stopPropagation()}>
          <NavigationItem
            as="div"
            onClick={() => handleNavigationItemClick(() => navigate("/Volcano/App"))}
            style={{ cursor: "pointer" }}
          >
            <PrideText text="Controls" />
            <ControlsIcon />
          </NavigationItem>
          <NavigationItem
            as="div"
            onClick={() => handleNavigationItemClick(() => navigate("/Volcano/WorkflowEditor"))}
            style={{ cursor: "pointer" }}
          >
            <PrideText text="Workflow Editor" />
            <WorkflowEditorIcon />
          </NavigationItem>
          <NavigationItem
            as="div"
            onClick={() => handleNavigationItemClick(() => navigate("/Volcano/ContactMe"))}
            style={{ cursor: "pointer" }}
          >
            <PrideText text="Contact Me" />
            <ContactMeIcon />
          </NavigationItem>
          <NavigationItem
            as="div"
            onClick={() => handleNavigationItemClick(() => navigate("/Volcano/Settings"))}
            style={{ cursor: "pointer" }}
          >
            <PrideText text="Settings" />
            <SettingsIcon />
          </NavigationItem>
          <NavigationItem
            as="div"
            onClick={() => {
              setShowNavigation(false);
              handleDisconnect();
            }}
            style={{ cursor: "pointer" }}
          >
            <PrideText text="Disconnect" />
            <BluetoothDisconnectIcon />
          </NavigationItem>
        </NavigationMenu>
      </NavigationOverlay>
    </MinimalistWrapper>
  );
}
