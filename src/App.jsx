import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BleConnectButtonContainer from "./features/deviceBLEconnection/BleContainer";
import VolcanoLoaderLoader from "./features/shared/OutletRenderer/VolcanoLoaderLoader";
import Volcano from "./features/deviceInteraction/DeviceInteraction";
import ContactMe from "./features/contactMe/ContactMe";
import { clearCache } from "./services/BleCharacteristicCache";
import "bootstrap/dist/css/bootstrap.min.css";
import Settings from "./features/settings/Settings";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import GetTheme from "./themes/ThemeProvider";
import WorkflowEditor from "./features/workflowEditor/WorkflowEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Snowfall from "./features/shared/Snowfall";
import { isMobile } from "./constants/constants";
import DragPreview from "./features/workflowEditor/DND/DragPreview";
import MinimalistLayout from "./features/shared/MinimalistLayout";
import { convertToFahrenheitFromCelsius } from "./services/utils";
import { DEGREE_SYMBOL, MIN_CELSIUS_TEMP, MAX_CELSIUS_TEMP } from "./constants/temperature";
const Div = styled.div`
  color: ${(props) => props.theme.primaryFontColor};
  background-color: ${(props) => props.theme.backgroundColor};
  width: 100vw;
  height: 100vh;
  display: flex;
`;

function AppRoutes({ isMinimalistMode }) {
  const location = useLocation();
  
  // Show minimalist mode only when connected (not on home page)
  const shouldShowMinimalistMode = isMinimalistMode && location.pathname !== "/";
  
  if (shouldShowMinimalistMode) {
    return <MinimalistLayout />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<BleConnectButtonContainer />} />
      <Route path="Volcano" element={<VolcanoLoaderLoader />}>
        <Route path="App" element={<Volcano />} />
        <Route path="Settings" element={<Settings />} />
        <Route path="WorkflowEditor" element={<WorkflowEditor />} />
        <Route path="ContactMe" element={<ContactMe />} />
      </Route>
      <Route path="*" element={<BleConnectButtonContainer />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    window.onunhandledrejection = (event) => {
      console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
      clearCache();
    };
  }, []);

  const themeId = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme().themeId
  );
  const isMinimalistMode = useSelector((state) => state.settings.config?.isMinimalistMode || false);
  
  // Temperature state for page title
  const currentTemperature = useSelector((state) => state.deviceInteraction.currentTemperature);
  const targetTemperature = useSelector((state) => state.deviceInteraction.targetTemperature);
  const isF = useSelector((state) => state.settings.isF);
  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  useEffect(() => {
    document.body.style = `background: ${GetTheme(themeId).backgroundColor};`;
  }, [themeId]);

  // Update page title with current and target temperature (works for both regular and minimalist mode)
  useEffect(() => {
    const currentTemp = currentTemperature || currentTemperature === 0
      ? isF
        ? convertToFahrenheitFromCelsius(currentTemperature)
        : currentTemperature
      : currentTemperature;

    const targetTemp = targetTemperature || targetTemperature === 0
      ? isF
        ? convertToFahrenheitFromCelsius(targetTemperature)
        : targetTemperature
      : targetTemperature;

    const showCurrentTemp = (!isNaN(parseInt(currentTemperature)) &&
      currentTemperature > MIN_CELSIUS_TEMP &&
      currentTemperature <= MAX_CELSIUS_TEMP) || isHeatOn;

    const displayCurrentTemperature = currentTemp && !isNaN(parseInt(currentTemp))
      ? Math.round(currentTemp)
      : null;
      
    const displayTargetTemperature = targetTemp && !isNaN(parseInt(targetTemp))
      ? Math.round(targetTemp)
      : null;
    
    if (displayCurrentTemperature && displayTargetTemperature && showCurrentTemp) {
      document.title = `${displayCurrentTemperature}/${displayTargetTemperature}${DEGREE_SYMBOL}${isF ? "F" : "C"} - Onyx`;
    } else if (displayCurrentTemperature && showCurrentTemp) {
      document.title = `${displayCurrentTemperature}${DEGREE_SYMBOL}${isF ? "F" : "C"} - Onyx`;
    } else {
      document.title = "Onyx";
    }
  }, [currentTemperature, targetTemperature, isF, isHeatOn]);

  return (
    <>
      <DndProvider
        backend={window.ontouchstart || isMobile ? TouchBackend : HTML5Backend}
      >
        <ThemeProvider theme={GetTheme(themeId)}>
          <DragPreview />
          <Div>
            <BrowserRouter>
              <AppRoutes isMinimalistMode={isMinimalistMode} />
            </BrowserRouter>
          </Div>
        </ThemeProvider>
      </DndProvider>
      <>
        <Snowfall />
      </>
    </>
  );
}

export default App;
