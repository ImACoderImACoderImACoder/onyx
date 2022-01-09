import { Range } from "react-range";

export default function SettingsRange({
  step,
  min,
  max,
  values,
  onChange,
  onFinalChange,
}) {
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
  );
}
