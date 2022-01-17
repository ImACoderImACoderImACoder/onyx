import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";
import FOrCLoader from "../../components/Volcano/features/FOrC/FOrCLoader";
import AdjustAutoShutoffTimeContainer from "./AdjustAutoShutoffTime/AdjustAutoShutoffTimeContainer";
import AdjustLEDbrightnessContainer from "./AdjustLEDbrightness/AdjustLEDbrightnessContainer";
import DisplayOnCoolingToggleContainer from "./DisplayOnCoolingToggle/DisplayOnCoolingToggleContainer";

import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";
import styled from "styled-components";
import { setCurrentTheme } from "./settingsSlice";
import { useDispatch } from "react-redux";

const Div = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function Settings() {
  const dispatch = useDispatch();

  return (
    <Div>
      <button
        onClick={() => {
          dispatch(setCurrentTheme("light"));
        }}
      />
      <FOrCLoader useSpinnerToShowLoader>
        <FOrC />
      </FOrCLoader>
      <AdjustLEDbrightnessContainer />
      <AdjustAutoShutoffTimeContainer />
      <VibrationToggleContainer />
      <DisplayOnCoolingToggleContainer />
      <TemperatureControlSettings />
    </Div>
  );
}
