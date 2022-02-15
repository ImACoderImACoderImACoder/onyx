import { Range } from "react-range";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertToFahrenheitFromCelsius,
  convertToUInt32BLE,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { writeTemperatureUuid } from "../../../constants/uuids";
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
} from "../../../constants/temperature";
import { setTargetTemperature } from "../deviceInteractionSlice";
import { useTheme } from "styled-components";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  justify-content: center;
`;

export default function TargetTemperatureRange() {
  const isF = useSelector((state) => state.settings.isF);

  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const dispatch = useDispatch();

  const onMouseUp = (e) => {
    const blePayload = async () => {
      const characteristic = getCharacteristic(writeTemperatureUuid);
      const buffer = convertToUInt32BLE(e[0] * 10);
      await characteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  };

  const onChange = (e) => {
    dispatch(setTargetTemperature(e[0]));
  };

  const middleValue = (MIN_CELSIUS_TEMP + MAX_CELSIUS_TEMP) / 2;
  const theme = useTheme();
  return (
    <Div>
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
              borderRadius: ".25rem",
              marginTop: "20px",
              marginBottom: "25px",
              height: "6px",
              maxWidth: "80vw",
              backgroundColor: "#f53803",
              background: `linear-gradient(315deg, ${theme.temperatureRange.lowTemperatureColor} 0%, ${theme.temperatureRange.highTemperatureColor} 74%)`,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            aria-valuenow={
              isF
                ? convertToFahrenheitFromCelsius(targetTemperature)
                : targetTemperature
            }
            style={{
              ...props.style,
              height: "42px",
              width: "42px",
              backgroundColor: theme.temperatureRange.rangeBoxColor,
              borderColor: theme.temperatureRange.rangeBoxBorderColor,
              borderStyle: "solid",
              borderRadius: ".25rem",
              borderWidth: "3px",
            }}
          />
        )}
      />
    </Div>
  );
}
