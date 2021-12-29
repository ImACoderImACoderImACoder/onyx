import FOrC from "../../components/Volcano/features/FOrC/FOrCContainer";

import "./Settings.css";
import TemperatureControlSettings from "./TemperatureControlValues.jsx/TemperatureControlSettingsContainer";

export default function Settings() {
  return (
    <div className="settings-main">
      <FOrC />
      <TemperatureControlSettings />
    </div>
  );
}
