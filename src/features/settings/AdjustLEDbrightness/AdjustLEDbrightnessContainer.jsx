import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertBLEtoUint16,
  convertToUInt16BLE,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { LEDbrightnessUuid } from "../../../constants/uuids";

import { setLEDbrightness } from "../settingsSlice";
import { useEffect } from "react";
import SettingsRange from "../Shared/SettingsRange/SettingsRange";
import Div from "../../../features/settings/Shared/StyledComponents/Div";
import PrideText from "../../../themes/PrideText";

export default function AdjustLEDbrightnessContainer() {
  const LEDbrightness = useSelector((state) => state.settings.LEDbrightness);

  const dispatch = useDispatch();
  useEffect(() => {
    if (LEDbrightness === undefined) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(LEDbrightnessUuid);
        const value = await characteristic.readValue();
        const normalizedValue = convertBLEtoUint16(value);
        dispatch(setLEDbrightness(normalizedValue));
      };
      AddToQueue(blePayload);
    }
  }, [LEDbrightness, dispatch]);

  const onMouseUp = (e) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(LEDbrightnessUuid);
      let buffer = convertToUInt16BLE(e[0]);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  };

  const onChange = (e) => {
    dispatch(setLEDbrightness(e[0]));
  };

  return (
    <Div>
      <h2><PrideText text="LED Brightness"/></h2>
      Current Brightness Level: {LEDbrightness}
      <SettingsRange
        values={[LEDbrightness || 0]}
        step={10}
        min={0}
        max={100}
        onChange={onChange}
        onFinalChange={onMouseUp}
      />
    </Div>
  );
}
