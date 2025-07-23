import { Range } from "react-range";
import { useTheme } from "styled-components";

export default function SettingsRange({
  step,
  min,
  max,
  values,
  onChange,
  onFinalChange,
}) {
  const theme = useTheme();
  return (
    <Range
      step={step}
      min={min}
      max={max}
      values={values}
      onChange={(values) => onChange(values)}
      onFinalChange={onFinalChange}
      renderTrack={({ props, children }) => {
        const { key, ...restProps } = props;
        return (
          <div
            key={key}
            {...restProps}
            style={{
              ...restProps.style,
              display: "flex",
              flexGrow: "1",
              marginTop: "20px",
              marginBottom: "25px",
              marginLeft: "25px",
              borderRadius: ".25rem",
              height: "6px",
              width: "200px",
              backgroundColor: "#f53803",
              background: `${theme.temperatureRange.background}`,
              borderWidth: "0px",
            }}
          >
            {children}
          </div>
        );
      }}
      renderThumb={({ props }) => {
        const { key, ...restProps } = props;
        return (
          <div
            key={key}
            {...restProps}
            style={{
              ...restProps.style,
              height: "42px",
              width: "42px",
              backgroundColor: theme.temperatureRange.rangeBoxColor,
              borderColor: theme.temperatureRange.rangeBoxBorderColor,
              borderStyle: "solid",
              borderWidth: theme.temperatureRange.rangeBoxBorderWidth,
              borderRadius: theme.temperatureRange.rangeBoxBorderRadius,
              background:
                theme.temperatureRange.rangeBackground ||
                theme.temperatureRange.rangeBoxColor,
            }}
          />
        );
      }}
    />
  );
}
