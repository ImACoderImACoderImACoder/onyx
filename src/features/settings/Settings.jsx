import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";
import FOrCLoader from "../../components/Volcano/features/FOrC/FOrCLoader";
import HoursOfOperationContainer from "../deviceInformation/HoursOfOperation/HoursOfOperationContainer";
import AdjustLEDbrightnessContainer from "./AdjustLEDbrightness/AdjustLEDbrightnessContainer";
import DisplayOnCoolingToggleContainer from "./DisplayOnCoolingToggle/DisplayOnCoolingToggleContainer";

import "./Settings.css";
import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";

export default function Settings() {
  return (
    <div className="settings-main">
      <HoursOfOperationContainer />
      <FOrCLoader useSpinnerToShowLoader>
        <FOrC />
      </FOrCLoader>
      <AdjustLEDbrightnessContainer />
      <VibrationToggleContainer />
      <DisplayOnCoolingToggleContainer />
      <TemperatureControlSettings />
    </div>
  );
}
