import { Range } from "react-range";
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
        return `LED brightness of ${normalizedValue} read from device`;
      };
      AddToQueue(blePayload);
    }
  }, [LEDbrightness, dispatch]);

  const onMouseUp = (e) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(LEDbrightnessUuid);
      let buffer = convertToUInt16BLE(e[0]);
      await characteristic.writeValue(buffer);
      return `LED brightness of ${e[0]} written to device`;
    };
    AddToQueue(blePayload);
  };

  const onChange = (e) => {
    dispatch(setLEDbrightness(e[0]));
  };

  return (
    <div>
      <h2>LED Brightness</h2>
      Current Brightness Level: {LEDbrightness}
      <Range
        step={10}
        min={0}
        max={100}
        values={[LEDbrightness || 0]}
        onChange={(values) => onChange(values)}
        onFinalChange={onMouseUp}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              display: "flex",
              flexGrow: "1",
              marginTop: "20px",
              marginBottom: "25px",
              marginLeft: "25px",
              height: "6px",
              width: "200px",
              backgroundColor: "#f53803",
              background: "linear-gradient(315deg, #fff 0%, rgb(50 46 46) 74%)",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "42px",
              width: "42px",
              backgroundColor: "black",
              borderColor: "afafaf",
              borderStyle: "solid",
              borderRadius: ".25rem",
            }}
          />
        )}
      />
    </div>
  );
}
