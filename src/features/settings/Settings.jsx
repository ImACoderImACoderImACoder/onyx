import FOrC from "./FOrC/FOrCContainer";
import FOrCLoader from "./FOrC/FOrCLoader";
import AdjustAutoShutoffTimeContainer from "./AdjustAutoShutoffTime/AdjustAutoShutoffTimeContainer";
import AdjustLEDbrightnessContainer from "./AdjustLEDbrightness/AdjustLEDbrightnessContainer";
import DisplayOnCoolingToggleContainer from "./DisplayOnCoolingToggle/DisplayOnCoolingToggleContainer";

import TemperatureControlSettings from "./TemperatureControlValues/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import ThemesContainer from "./Theming/ThemesContainer";
import PrideText from "../../themes/PrideText";

export default function Settings() {
  return (
    <Div>
      <h1>
        <PrideText text="Settings" />
      </h1>
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
