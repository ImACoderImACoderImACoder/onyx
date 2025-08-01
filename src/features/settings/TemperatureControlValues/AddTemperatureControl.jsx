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
import StyledFormControl from "../../shared/styledComponents/FormControl";
import { useTranslation } from "react-i18next";

export default function AddTemperatureControl() {
  const { t } = useTranslation();
  const config = useSelector((state) => state.settings.config);
  const isF = useSelector((state) => state.settings.isF);
  const dispatch = useDispatch();

  const fOrCMessage = isF
    ? `${convertToFahrenheitFromCelsius(
        MIN_CELSIUS_TEMP
      )}-${convertToFahrenheitFromCelsius(MAX_CELSIUS_TEMP)} ${DEGREE_SYMBOL}F`
    : `${MIN_CELSIUS_TEMP}-${MAX_CELSIUS_TEMP} ${DEGREE_SYMBOL}C`;
  const inputHelperText = t('settings.temperatureControl.temperatureRange', { range: fOrCMessage });
  const fOrC = `${DEGREE_SYMBOL}${isF ? "F" : "C"}`;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const parsedValue = parseInt(e.target[0].value);
        if (isNaN(parsedValue)) {
          alert(t('settings.temperatureControl.invalidTemperature'));
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
          alert(inputHelperText);
        }
      }}
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>{t('settings.temperatureControl.temperatureIn', { unit: fOrC })}</Form.Label>
        <StyledFormControl
          style={{ maxWidth: "250px" }}
          type="number"
          placeholder={`E.g ${isF ? "420" : "69"} ${fOrC}`}
          pattern="[0-9]*"
        />
        <Form.Text>{inputHelperText}</Form.Text>
      </Form.Group>
      <Button type="submit">{t('settings.temperatureControl.submit')}</Button> <RestoreDefaultTemperature />
    </Form>
  );
}
