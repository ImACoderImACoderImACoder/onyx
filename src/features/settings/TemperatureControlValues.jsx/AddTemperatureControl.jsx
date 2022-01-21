import Form from "react-bootstrap/Form";
import Button from "../../shared/styledComponents/Button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  WriteNewConfigToLocalStorage,
  convertToCelsiusFromFahrenheit,
  convertToFahrenheitFromCelsius,
} from "../../../services/utils";
import { setTemperatureControls } from "../settingsSlice";
import {
  MAX_CELSIUS_TEMP,
  MIN_CELSIUS_TEMP,
  DEGREE_SYMBOL,
} from "../../../constants/temperature";
import RestoreDefaultTemperature from "./RestoreDefaultTemperature";
import styled, { useTheme } from "styled-components";

const StyledButton = styled(Button)`
  color: ${(props) => props.theme.settingsPageColor};
`;

const StyledFormText = styled(Form.Text)`
  color: ${(props) => props.theme.settingsPageColor};
`;

export default function AddTemperatureControl() {
  const config = useSelector((state) => state.settings.config);
  const isF = useSelector((state) => state.settings.isF);
  const theme = useTheme();
  const dispatch = useDispatch();

  const fOrCMessage = isF
    ? `${convertToFahrenheitFromCelsius(
        MIN_CELSIUS_TEMP
      )}-${convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)} ${DEGREE_SYMBOL}F`
    : `${MIN_CELSIUS_TEMP}-${MAX_CELSIUS_TEMP} ${DEGREE_SYMBOL}C`;
  const inputHelperText = `Temperature must be between ${fOrCMessage}`;
  const fOrC = `${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const parsedValue = parseInt(e.target[0].value);
        if (isNaN(parsedValue)) {
          alert("Ivalid temperature value.");
          return;
        }

        const newTemperatureValue = isF
          ? convertToCelsiusFromFahrenheit(parsedValue)
          : parsedValue;
        if (
          newTemperatureValue >= MIN_CELSIUS_TEMP &&
          newTemperatureValue <= MAX_CELSIUS_TEMP
        ) {
          if (
            config.temperatureControlValues.some(
              (t) => t === newTemperatureValue
            )
          ) {
            return;
          }
          const newTemperatures = [
            ...config.temperatureControlValues,
            newTemperatureValue,
          ];
          WriteNewConfigToLocalStorage({
            ...config,
            temperatureControlValues: newTemperatures,
          });
          dispatch(setTemperatureControls(newTemperatures));
        } else {
          alert(`${inputHelperText}`);
        }
      }}
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{`Temperature in ${fOrC}`}</Form.Label>
        <Form.Control
          style={{
            maxWidth: "250px",
            color: theme.settingsPageColor,
            backgroundColor: theme.backgroundColor,
            borderColor: theme.borderColor,
          }}
          type="number"
          placeholder={`E.g ${isF ? "420" : "69"} ${fOrC}`}
          pattern="[0-9]*"
        />
        <StyledFormText>{inputHelperText}</StyledFormText>
      </Form.Group>
      <StyledButton type="submit">Submit</StyledButton>{" "}
      <RestoreDefaultTemperature />
    </Form>
  );
}
