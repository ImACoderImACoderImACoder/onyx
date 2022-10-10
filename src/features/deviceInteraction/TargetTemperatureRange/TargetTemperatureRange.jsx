import { Range } from "react-range";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AddToQueue } from "../../../services/bleQueueing";
import {
  convertToFahrenheitFromCelsius,
  convertToUInt32BLE,
} from "../../../services/utils";
import { getCharacteristic } from "../../../services/BleCharacteristicCache";
import { writeTemperatureUuid, heatOnUuid } from "../../../constants/uuids";
import { MAX_CELSIUS_TEMP } from "../../../constants/temperature";
import { convertToUInt8BLE } from "../../../services/utils";
import { setTargetTemperature } from "../deviceInteractionSlice";
import { setIsHeatOn } from "../deviceInteractionSlice";
import { useTheme } from "styled-components";
import styled from "styled-components";
import { AddToPriorityQueue } from "../../../services/bleQueueing";

const Div = styled.div`
  display: flex;
  justify-content: center;
`;

export default function TargetTemperatureRange() {
  const MIN_CELSIUS_TEMP = 170;
  const middleValue = (MIN_CELSIUS_TEMP + MAX_CELSIUS_TEMP) / 2;

  const isF = useSelector((state) => state.settings.isF);
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);
  const targetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature || middleValue
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
    if (!isHeatOn) {
      const blePayload = async () => {
        const characteristic = getCharacteristic(heatOnUuid);
        const buffer = convertToUInt8BLE(0);
        await characteristic.writeValue(buffer);
        dispatch(setIsHeatOn(true));
      };
      AddToPriorityQueue(blePayload);
    }
    dispatch(setTargetTemperature(e[0]));
  };

  const sliderDisplayValue =
    targetTemperature > MIN_CELSIUS_TEMP ? targetTemperature : MIN_CELSIUS_TEMP;
  const theme = useTheme();
  return (
    <Div>
      <Range
        step={1}
        min={MIN_CELSIUS_TEMP}
        max={MAX_CELSIUS_TEMP}
        values={[sliderDisplayValue]}
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
              background: `${theme.temperatureRange.background}`,
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
              background:
                theme.temperatureRange.rangeBackground ||
                theme.temperatureRange.rangeBoxColor,
            }}
          />
        )}
      />
    </Div>
  );
}
