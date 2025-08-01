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
import TurnHeatOnWhenConnectionIsEstablished from "./TurnHeatOnWhenConnectionIsEstablished/TurnHeatOnWhenConnectionIsEstablished";
import HighlightLastRunWorkflow from "./HighlightLastRunWorkflow/HighlightLastRunWorkflow";
import PWAInstall, { usePWAInstallAvailable } from "./InstallPWA/PWAInstall";
import SettingsSection from "./SettingsSection";
import DeviceInformation from "../deviceInformation/DeviceInformation";

export default function Settings() {
  const isPWAAvailable = usePWAInstallAvailable();
  return (
    <Div>
      <h1>
        <PrideText text="Settings" />
      </h1>

      <SettingsSection
        title="Appearance"
        icon="🎨"
        description="Customize the look of your app"
        defaultExpanded={true}
      >
        <ThemesContainer />
      </SettingsSection>

      <SettingsSection
        title="App Behavior"
        icon="⚙️"
        description="Control how the app behaves and displays information"
      >
        <TurnHeatOnWhenConnectionIsEstablished />
        <HighlightLastRunWorkflow />
        <TemperatureControlSettings />
      </SettingsSection>

      {isPWAAvailable && (
        <SettingsSection
          title="System"
          icon="📱"
          description="System settings and app installation"
        >
          <PWAInstall />
        </SettingsSection>
      )}

      <SettingsSection
        title="Volcano Controls"
        icon="🌋"
        description="Configure your Volcano's settings"
        defaultExpanded={false}
      >
        <AdjustAutoShutoffTimeContainer />
        <AdjustLEDbrightnessContainer />
        <VibrationToggleContainer />
        <DisplayOnCoolingToggleContainer />
        <FOrCLoader useSpinnerToShowLoader>
          <FOrC />
        </FOrCLoader>
      </SettingsSection>
      <SettingsSection
        title="Device Information"
        icon="📋"
        description="View details about your connected Volcano device"
        defaultExpanded={false}
      >
        <DeviceInformation />
      </SettingsSection>
    </Div>
  );
}
