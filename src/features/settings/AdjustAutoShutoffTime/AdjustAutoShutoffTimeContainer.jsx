import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToPriorityQueue, AddToQueue } from "../../../services/bleQueueing";
import {
  convertToUInt8BLE,
  convertBLEtoUint16,
  convertToUInt16BLE,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { autoShutoffSettingUuid, heatOffUuid } from "../../../constants/uuids";
import { setAutoShutoffTime } from "../settingsSlice";
import { useEffect, useState } from "react";
import SettingsRange from "../Shared/SettingsRange/SettingsRange";
import SettingsItem from "../SettingsItem";
import { setIsHeatOn } from "../../deviceInteraction/deviceInteractionSlice";

export default function AdjustAutoShutoffTimeContainer() {
  const autoShutoffTime = useSelector(
    (state) => state.settings.autoShutoffTime
  );

  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const [didAttemptTurnHeatOff, setDidAttemptTurnHeatOff] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (autoShutoffTime === undefined) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(autoShutoffSettingUuid);
        const value = await characteristic.readValue();
        const normalizedValue = convertBLEtoUint16(value) / 60;
        dispatch(setAutoShutoffTime(normalizedValue));
      };
      AddToQueue(blePayload);
    }
  }, [autoShutoffTime, dispatch]);

  useEffect(() => {
    setDidAttemptTurnHeatOff(false);
  }, [isHeatOn]);
  const onMouseUp = (e) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(autoShutoffSettingUuid);
      const buffer = convertToUInt16BLE(e[0] * 60);
      await characteristic.writeValue(buffer);

      if (isHeatOn) {
        const heatOffCharacteristic = getCharacteristic(heatOffUuid);
        const heatOffBuffer = convertToUInt8BLE(0);
        await heatOffCharacteristic.writeValue(heatOffBuffer);
        setDidAttemptTurnHeatOff(true);
      }
    };
    AddToPriorityQueue(blePayload);
  };

  const onChange = (e) => {
    if (!didAttemptTurnHeatOff && isHeatOn) {
      setDidAttemptTurnHeatOff(true);
      dispatch(setIsHeatOn(false));
      const blePayload = async () => {
        const heatOffCharacteristic = getCharacteristic(heatOffUuid);
        const heatOffBuffer = convertToUInt8BLE(0);
        await heatOffCharacteristic.writeValue(heatOffBuffer);
      };
      AddToPriorityQueue(blePayload);
    }

    dispatch(setAutoShutoffTime(e[0]));
  };

  return (
    <SettingsItem
      title="Auto Shutoff Timer"
      description="Set how long the heater stays on before automatically turning off for safety. The circle with a number on the controls screen shows the countdown. Adjusting this will temporarily turn off the heat."
    >
      <div>
        Current Time: {autoShutoffTime} minutes
        <SettingsRange
          values={[autoShutoffTime || 30]}
          step={5}
          min={5}
          max={360}
          onChange={onChange}
          onFinalChange={onMouseUp}
        />
      </div>
    </SettingsItem>
  );
}
