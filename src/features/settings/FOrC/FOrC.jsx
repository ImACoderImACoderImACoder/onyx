import SettingsItem from "../SettingsItem";
import Button from "../../shared/styledComponents/Button";
import PrideText from "../../../themes/PrideText";

export default function FOrC(props) {
  const currentScale =
    props.temperatureScaleAbbreviation === "F" ? "Celsius" : "Fahrenheit";

  return (
    <SettingsItem
      title="Temperature Scale"
      description={`Currently using ${currentScale}. Switch between Fahrenheit and Celsius.`}
    >
      <Button onClick={props.onClick}>
        <PrideText text={`Change To: ${props.temperatureScaleAbbreviation}`} />
      </Button>
    </SettingsItem>
  );
}
