import { Range } from "react-range";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToQueue } from "../../../services/bleQueueing";
import { convertToUInt32BLE } from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { bleServerUuid, writeTemperatureUuid } from "../../../constants/uuids";
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../constants/temperature";
import { setTargetTemperature } from "../deviceInteractionSlice";

export default function TargetTemperatureRange() {
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const dispatch = useDispatch();

  const onMouseUp = (e) => {
    const blePayload = async () => {
      const bleServer = getCharacteristic(bleServerUuid);
      const characteristic = getCharacteristic(writeTemperatureUuid);
      if (bleServer.device.name.includes("S&B VOLCANO")) {
        let buffer = convertToUInt32BLE(e[0] * 10);
        await characteristic.writeValue(buffer);
        return `Temperature ${e[0]}C written to device`;
      }
    };
    AddToQueue(blePayload);
  };

  const onChange = (e) => {
    dispatch(setTargetTemperature(e[0]));
  };

  const middleValue = (MIN_CELSIUS_TEMP + MAX_CELSIUS_TEMP) / 2;
  return (
    <div>
      <Range
        step={1}
        min={MIN_CELSIUS_TEMP}
        max={MAX_CELSIUS_TEMP}
        values={[targetTemperature || middleValue]}
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
              height: "6px",
              width: "80vw",
              backgroundColor: "#f53803",
              background: "linear-gradient(315deg, #f53803 0%, #f5d020 74%)",
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
              borderColor: "orange",
              borderStyle: "solid",
              borderRadius: ".25rem",
            }}
          />
        )}
      />
    </div>
  );
}
