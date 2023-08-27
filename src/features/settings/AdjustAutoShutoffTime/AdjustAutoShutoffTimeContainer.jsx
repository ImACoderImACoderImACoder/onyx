import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToUInt16BLE,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { autoShutoffSettingUuid } from "../../../constants/uuids";

import { setAutoShutoffTime } from "../settingsSlice";
import { useEffect } from "react";
import SettingsRange from "../Shared/SettingsRange/SettingsRange";
import Div from "../Shared/StyledComponents/Div";
import PrideText from "../../../themes/PrideText";

export default function AdjustAutoShutoffTimeContainer() {
  const autoShutoffTime = useSelector(
    (state) => state.settings.autoShutoffTime
  );

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

  const onMouseUp = (e) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(autoShutoffSettingUuid);
      let buffer = convertToUInt16BLE(e[0] * 60);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  };

  const onChange = (e) => {
    dispatch(setAutoShutoffTime(e[0]));
  };

  return (
    <Div>
      <h2>
        <PrideText text="Auto Shutoff Time" />
      </h2>
      Current Auto Shutoff Time: {autoShutoffTime}
      <SettingsRange
        values={[autoShutoffTime || 30]}
        //15 is 15 below the official S&B minimum but everything still works fine
        step={15}
        min={15}
        max={360}
        onChange={onChange}
        onFinalChange={onMouseUp}
      />
    </Div>
  );
}
