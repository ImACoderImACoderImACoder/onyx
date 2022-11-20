import { Range } from "react-range";
import { useTheme } from "styled-components";

interface SettingsRangeProps {
  step: number;
  min: number;
  max: number;
  values: Array<number>;
  onChange: (e: Array<Number>) => void;
  onFinalChange: (e: Array<Number>) => void;
}

export default function SettingsRange({
  step,
  min,
  max,
  values,
  onChange,
  onFinalChange,
}: SettingsRangeProps) {
  //todo how to do this better?
  const theme: any = useTheme();
  return (
    <Range
      step={step}
      min={min}
      max={max}
      values={values}
      onChange={(values) => onChange(values)}
      onFinalChange={onFinalChange}
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
            borderRadius: ".25rem",
            height: "6px",
            width: "200px",
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
          style={{
            ...props.style,
            height: "42px",
            width: "42px",
            backgroundColor: theme.temperatureRange.rangeBoxColor,
            borderColor: theme.temperatureRange.rangeBoxBorderColor,
            borderStyle: "solid",
            borderRadius: ".25rem",
            background:
              theme.temperatureRange.rangeBackground ||
              theme.temperatureRange.rangeBoxColor,
          }}
        />
      )}
    />
  );
}
