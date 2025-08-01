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
import SettingsItem from "../SettingsItem";
import { useTranslation } from "react-i18next";

export default function AdjustLEDbrightnessContainer() {
  const { t } = useTranslation();
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
    <SettingsItem
      title={t('settings.items.ledDisplayBrightness.title')}
      description={t('settings.items.ledDisplayBrightness.description')}
    >
      <div>
        Current Level: {LEDbrightness}
        <SettingsRange
          values={[LEDbrightness || 0]}
          step={10}
          min={0}
          max={100}
          onChange={onChange}
          onFinalChange={onMouseUp}
        />
      </div>
    </SettingsItem>
  );
}
