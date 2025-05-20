import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./features/deviceBLEconnection/BleContainer";
import VolcanoLoaderLoader from "./features/shared/OutletRenderer/VolcanoLoaderLoader";
import Volcano from "./features/deviceInteraction/DeviceInteraction";
import { DeviceInformationWithToggleControls } from "./features/deviceInformation/DeviceInformation";
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
import useGamepad from "./services/gamepad";
const Div = styled.div`
  color: ${(props) => props.theme.primaryFontColor};
  background-color: ${(props) => props.theme.backgroundColor};
  width: 100vw;
  height: 100vh;
  display: flex;
`;

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

  useEffect(() => {
    document.body.style = `background: ${GetTheme(themeId).backgroundColor};`;
  }, [themeId]);

  useGamepad();

  return (
    <>
      <DndProvider
        backend={window.ontouchstart || isMobile ? TouchBackend : HTML5Backend}
      >
        <ThemeProvider theme={GetTheme(themeId)}>
          <DragPreview />
          <Div>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<BleConnectButtonContainer />} />
                <Route path="Volcano" element={<VolcanoLoaderLoader />}>
                  <Route path="App" element={<Volcano />} />
                  <Route
                    path="DeviceInformation"
                    element={<DeviceInformationWithToggleControls />}
                  />
                  <Route path="Settings" element={<Settings />} />
                  <Route path="WorkflowEditor" element={<WorkflowEditor />} />
                  <Route path="ContactMe" element={<ContactMe />} />
                </Route>
              </Routes>
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
