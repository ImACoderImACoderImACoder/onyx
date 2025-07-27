import { useDispatch, useSelector } from "react-redux";
import { setIsMinimalistMode } from "../settings/settingsSlice";
import styled from "styled-components";
import WriteTemperature from "../deviceInteraction/WriteTemperature/WriteTemperature";
import PrideText from "../../themes/PrideText";
import { useRef, useEffect, useState } from "react";
import WorkFlow from "../workflowEditor/WorkflowButtons";
import {
  setIsHeatOn,
  setIsFanOn,
} from "../deviceInteraction/deviceInteractionSlice";
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
} from "../../constants/uuids";
import { useNavigate } from "react-router-dom";
import FanIcon from "./OutletRenderer/icons/FanIcon";
import BluetoothDisconnectIcon from "./OutletRenderer/icons/BluetoothDisconnectIcon";
import ControlsIcon from "./OutletRenderer/icons/ControlsIcon";
import PlusMinusButton from "../deviceInteraction/WriteTemperature/PlusMinusButton";
import {
  convertToUInt32BLE,
  convertToUInt8BLE,
  isValueInValidVolcanoCelciusRange,
  convertToFahrenheitFromCelsius,
  convertCurrentTemperatureCharacteristicToCelcius,
  convertBLEtoUint16,
  convertToggleCharacteristicToBool,
} from "../../services/utils";
import { AddToPriorityQueue, AddToQueue } from "../../services/bleQueueing";
import {
  setTargetTemperature,
  setCurrentTemperature,
} from "../deviceInteraction/deviceInteractionSlice";
import { setIsF } from "../settings/settingsSlice";
import debounce from "lodash/debounce";
import { temperatureIncrementedDecrementedDebounceTime } from "../../constants/constants";
import { DEGREE_SYMBOL } from "../../constants/temperature";
import { heatingMask, fanMask, fahrenheitMask } from "../../constants/masks";
import store from "../../store";
import CurrentTemperature from "../deviceInteraction/CurrentTemperature/CurrentTemperature";
import CurrentTargetTemperature from "../deviceInteraction/CurrentTargetTemperature/CurrentTargetTemperature";

const MinimalistWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 12% 64% 24%;
  grid-template-rows: 1fr;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  min-width: 300px;
  overflow: hidden;
  gap: 5px;
  padding: 5px;

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
  flex-direction: column-reverse;
  padding: 0 5px;
  gap: 10px;
`;

const MiddleColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  gap: 10px;
  padding: 0 10px;
  justify-content: flex-end;

  &.temperature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
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
  padding: 0 5px;
`;

const HeatFanSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  flex: 1;
  min-height: 60px;
`;

const PlusMinusSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  flex: 1;
  min-height: 60px;
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
  flex: 1;
  max-height: 60px; /* Prevent excessive growth */

  & > div {
    height: 100% !important;
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
      width: 24px;
      height: 24px;
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

const DisconnectButton = styled(WriteTemperature)`
  flex: 1;
  height: 50%;

  & > div {
    height: 100% !important;
  }

  button {
    background: linear-gradient(145deg, #dc3545, #dc3545cc);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 4px;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    &:hover {
      background: #c82333;
    }
  }
`;

const WorkflowButton = styled(WriteTemperature)`
  flex: 1;
  min-height: 45px;

  & > div {
    height: 100% !important;
  }

  button {
    padding: 8px 12px;
    font-size: 16px;
    height: 100%;
    width: 100%;
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    border-radius: 8px;
  }

  /* Target PrideText spans inside buttons */
  span {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
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
      padding: 8px 4px;
      font-size: 16px;
      border-radius: 8px;
      height: 100%;
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
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

const FanButton = styled(WriteTemperature)`
  width: 100%;
  height: 100%;

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
      width: 24px;
      height: 24px;
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


const MinimalistPlusMinusButton = styled(WriteTemperature)`
  width: 100%;
  height: 100%;

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
      width: 24px;
      height: 24px;
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

export default function MinimalistLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workflows = useSelector(
    (state) => state.settings.config.workflows.items
  );
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );
  const lastWorkflowRunId = useSelector(
    (state) => state.workflow.lastWorkflowRunId
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
  const workflowRef = useRef(null);
  const [useIcons, setUseIcons] = useState(false);

  useEffect(() => {
    const checkColumnWidth = () => {
      setUseIcons(window.innerWidth < 600); // Use icons when window is narrow
    };

    checkColumnWidth();
    window.addEventListener("resize", checkColumnWidth);
    return () => window.removeEventListener("resize", checkColumnWidth);
  }, []);

  // Current temperature BLE handler
  useEffect(() => {
    const BlePayload = async () => {
      try {
        const characteristic = getCharacteristic(currentTemperatureUuid);
        if (!characteristic) {
          console.warn("Current temperature characteristic not found in minimalist mode");
          return;
        }

        const onCharacteristicChange = (event) => {
          const currentTemperature =
            convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
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
        console.error("Error setting up current temperature BLE handler in minimalist mode:", error);
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
          console.warn("Target temperature characteristic not found in minimalist mode");
          return;
        }

        const handleTargetTemperatureChanged = (event) => {
          const targetTemperature =
            convertCurrentTemperatureCharacteristicToCelcius(event.target.value);
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
        console.error("Error setting up target temperature BLE handler in minimalist mode:", error);
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
              console.error("Error reading current temperature on visibility change:", error);
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
              console.error("Error reading target temperature on visibility change:", error);
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
        console.error("Error setting up heat/fan status BLE handler in minimalist mode:", error);
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
        console.error("Error setting up temperature unit BLE handler in minimalist mode:", error);
        navigate("/");
      }
    };
    AddToQueue(blePayload);
  }, [dispatch, navigate]);

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
            console.error("Temperature characteristic not found - redirecting to home");
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
            console.error("Heat characteristic not found - redirecting to home");
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
            console.error("Heat characteristic not found - redirecting to home");
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

  const handleExit = () => {
    dispatch(setIsMinimalistMode(false));
    navigate("/Volcano/App");
  };

  const handleWorkflowClick = (index) => {
    // Click the corresponding button in the hidden WorkFlow component
    const buttons = workflowRef.current?.querySelectorAll(
      ".temperature-write-div button"
    );
    if (buttons && buttons[index]) {
      buttons[index].click();
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

  const handleFanClick = () => {
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
  };

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
        <LeftColumnTemperatureDisplay>
          <TemperatureRow>
            <CurrentTemperature
              currentTemperature={displayCurrentTemperature}
              temperatureSuffix={temperatureSuffix}
            />
          </TemperatureRow>
          <TemperatureRow style={{ opacity: isHeatOn ? "1" : "0", transition: "all 0.35s" }}>
            <CurrentTargetTemperature
              currentTargetTemperature={displayTargetTemperature}
              temperatureSuffix={temperatureSuffix}
            />
          </TemperatureRow>
        </LeftColumnTemperatureDisplay>
        
        <ExitButton onClick={handleExit} buttonText={<ControlsIcon />} />
        <ExitButton
          onClick={handleDisconnect}
          buttonText={<BluetoothDisconnectIcon />}
        />
      </LeftColumn>
      
      <MiddleColumn
        className={workflows.length === 0 ? "temperature-grid" : ""}
      >
        {workflows.length > 0
          ? workflows.map((item, index) => {
              const isActive = currentWorkflow?.id === item.id;
              const isLastRunWorkflow =
                item.id === lastWorkflowRunId && !isActive;
              const buttonText = isActive ? "Tap to Cancel" : item.name;

              return (
                <WorkflowButton
                  key={index}
                  onClick={() => handleWorkflowClick(index)}
                  buttonText={<PrideText text={buttonText} />}
                  isActive={isActive}
                  isGlowy={highlightLastRunWorkflow && isLastRunWorkflow}
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
      </RightColumn>

      <HiddenWorkflowContainer ref={workflowRef}>
        <WorkFlow />
      </HiddenWorkflowContainer>
    </MinimalistWrapper>
  );
}
