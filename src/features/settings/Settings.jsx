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
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const isPWAAvailable = usePWAInstallAvailable();
  return (
    <Div>
      <h1>
        <PrideText text={t("settings.title")} />
      </h1>

      <SettingsSection
        title={t("settings.appearance.title")}
        icon="🎨"
        description={t("settings.appearance.description")}
        defaultExpanded={true}
      >
        <ThemesContainer />
      </SettingsSection>

      <SettingsSection
        title={t("settings.behavior.title")}
        icon="⚙️"
        description={t("settings.behavior.description")}
      >
        <LanguageSelector />
        <TurnHeatOnWhenConnectionIsEstablished />
        <HighlightLastRunWorkflow />
        <TemperatureControlSettings />
      </SettingsSection>

      {isPWAAvailable && (
        <SettingsSection
          title={t("settings.system.title")}
          icon="📱"
          description={t("settings.system.description")}
        >
          <PWAInstall />
        </SettingsSection>
      )}

      <SettingsSection
        title={t("settings.volcano.title")}
        icon="🌋"
        description={t("settings.volcano.description")}
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
        title={t("settings.device.title")}
        icon="📋"
        description={t("settings.device.description")}
        defaultExpanded={false}
      >
        <DeviceInformation />
      </SettingsSection>
    </Div>
  );
}
