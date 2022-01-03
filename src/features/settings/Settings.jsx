import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";

import "./Settings.css";
import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";
import VibrationToggleContainer from "./VibrationToggle/VibrationToggleContainer";

export default function Settings() {
  return (
    <div className="settings-main">
      <FOrC />
      <VibrationToggleContainer />
      <TemperatureControlSettings />
    </div>
  );
}
