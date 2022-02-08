import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";
import FOrCLoader from "../../components/Volcano/features/FOrC/FOrCLoader";
import AdjustAutoShutoffTimeContainer from "./AdjustAutoShutoffTime/AdjustAutoShutoffTimeContainer";
import AdjustLEDbrightnessContainer from "./AdjustLEDbrightness/AdjustLEDbrightnessContainer";
import DisplayOnCoolingToggleContainer from "./DisplayOnCoolingToggle/DisplayOnCoolingToggleContainer";

import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";
import styled from "styled-components";
import ThemesContainer from "./Theming/ThemesContainer";

const Div = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

export default function Settings() {
  return (
    <Div>
      <h1>Settings</h1>
      <ThemesContainer />
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
