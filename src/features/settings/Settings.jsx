import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";
import FOrCLoader from "../../components/Volcano/features/FOrC/FOrCLoader";
import AdjustAutoShutoffTimeContainer from "./AdjustAutoShutoffTime/AdjustAutoShutoffTimeContainer";
import AdjustLEDbrightnessContainer from "./AdjustLEDbrightness/AdjustLEDbrightnessContainer";
import DisplayOnCoolingToggleContainer from "./DisplayOnCoolingToggle/DisplayOnCoolingToggleContainer";

import "./Settings.css";
import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";

export default function Settings() {
  return (
    <div className="settings-main">
      <FOrCLoader useSpinnerToShowLoader>
        <FOrC />
      </FOrCLoader>
      <AdjustLEDbrightnessContainer />
      <AdjustAutoShutoffTimeContainer />
      <VibrationToggleContainer />
      <DisplayOnCoolingToggleContainer />
      <TemperatureControlSettings />
    </div>
  );
}
