import VolcanoLoader from "./VolcanoLoader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingConection from "../../deviceBLEconnection/LoadingConnection";
import {
  cacheContainsCharacteristic,
  getCharacteristic,
} from "../../../services/BleCharacteristicCache";
import {
  convertBLEtoUint16,
  convertToUInt16BLE,
  convertToUInt8BLE,
  convertToggleCharacteristicToBool,
  ReadConfigFromLocalStorage,
} from "../../../services/utils";
import { fahrenheitMask, heatingMask, fanMask } from "../../../constants/masks";
import {
  register2Uuid,
  heatOffUuid,
  heatOnUuid,
  LEDbrightnessUuid,
  register1Uuid,
} from "../../../constants/uuids";
import { useSelector, useDispatch } from "react-redux";
import { setIsF, setLEDbrightness } from "../../settings/settingsSlice";
import { AddToPriorityQueue } from "../../../services/bleQueueing";
import {
  setIsFanOn,
  setIsHeatOn,
} from "../../deviceInteraction/deviceInteractionSlice";

function ForCLoader(props) {
  const dispatch = useDispatch();
  const isF = useSelector((state) => state.settings.isF);

  useEffect(() => {
    if (isF !== undefined || !cacheContainsCharacteristic(register2Uuid))
      return;

    const characteristicPrj2V = getCharacteristic(register2Uuid);
    const blePayload = async () => {
      const value = await characteristicPrj2V.readValue();
      const convertedValue = convertBLEtoUint16(value);
      const isFValue = convertToggleCharacteristicToBool(
        convertedValue,
        fahrenheitMask
      );
      dispatch(setIsF(isFValue));
    };
    AddToPriorityQueue(blePayload);
  }, [dispatch, isF]);

  return <>{props.children}</>;
}

function IsHeatOnLoader(props) {
  const dispatch = useDispatch();
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  useEffect(() => {
    if (isHeatOn !== undefined || !cacheContainsCharacteristic(register1Uuid)) {
      return;
    }
    const config = ReadConfigFromLocalStorage();
    if (config.onConnectTurnHeatOn) {
      const blePayload = async () => {
        let characteristic = getCharacteristic(heatOnUuid);
        let buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
        dispatch(setIsHeatOn(true));

        //This little section of code is mostly for me
        characteristic = getCharacteristic(LEDbrightnessUuid);
        const value = await characteristic.readValue();
        const screenBrightness = convertBLEtoUint16(value);
        if (screenBrightness === 0) {
          const defaultLEDbrightness = 70;
          let buffer = convertToUInt16BLE(defaultLEDbrightness);
          await characteristic.writeValue(buffer);
          dispatch(setLEDbrightness(defaultLEDbrightness));
        }
      };
      AddToPriorityQueue(blePayload);
    }

    const blePayload = async () => {
      const characteristicPrj1V = getCharacteristic(register1Uuid);
      const value = await characteristicPrj1V.readValue();
      const currentVal = convertBLEtoUint16(value);
      const newHeatValue = convertToggleCharacteristicToBool(
        currentVal,
        heatingMask
      );
      if (!config.onConnectTurnHeatOn) {
        dispatch(setIsHeatOn(newHeatValue));
      }

      const newFanValue = convertToggleCharacteristicToBool(
        currentVal,
        fanMask
      );

      dispatch(setIsFanOn(newFanValue));
    };
    AddToPriorityQueue(blePayload);
  }, [dispatch, isHeatOn]);

  return <>{props.children}</>;
}

export default function VolcanoLoaderLoader() {
  const navigate = useNavigate();
  const isF = useSelector((state) => state.settings.isF);
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const isFanOn = useSelector((state) => state.deviceInteraction.isFanOn);

  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });

  return (
    (isF !== undefined && isFanOn !== undefined && isHeatOn !== undefined && (
      <VolcanoLoader />
    )) || (
      <IsHeatOnLoader>
        <ForCLoader>
          <LoadingConection />
        </ForCLoader>
      </IsHeatOnLoader>
    )
  );
}
