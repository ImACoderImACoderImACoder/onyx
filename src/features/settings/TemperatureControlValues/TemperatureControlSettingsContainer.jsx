import { useSelector } from "react-redux";
import AddTemperatureControl from "./AddTemperatureControl";
import TemperatureControlSettings from "./TemperatureControlSettings";
import {
  convertToFahrenheitFromCelsius,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";
import { useDispatch } from "react-redux";
import { setTemperatureControls } from "../settingsSlice";
import styled from "styled-components";
import PrideText from "../../../themes/PrideText";
import { useTranslation } from "react-i18next";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function TemperatureControlSettingsContainer() {
  const { t } = useTranslation();
  const config = useSelector((state) => state.settings.config);
  const isF = useSelector((state) => state.settings.isF);
  const currentTemperatureContorls = config.temperatureControlValues;
  const dispatch = useDispatch();

  const onDelete = (temperature) => () => {
    const newTemperatureControls = currentTemperatureContorls.filter(
      (t) => t !== temperature
    );
    WriteNewConfigToLocalStorage({
      ...config,
      temperatureControlValues: newTemperatureControls,
    });
    dispatch(setTemperatureControls(newTemperatureControls));
  };
  const temperatures = currentTemperatureContorls.map((t) => {
    const temperature = isF ? convertToFahrenheitFromCelsius(t) : t;
    return (
      <TemperatureControlSettings
        key={t}
        temperature={temperature}
        onClick={onDelete(t)}
      />
    );
  });

  return (
    <StyledDiv>
      <h2>
        <PrideText text={t("settings.temperatureControl.addTemperatureControls")} />
      </h2>
      {temperatures}
      <AddTemperatureControl />
    </StyledDiv>
  );
}
