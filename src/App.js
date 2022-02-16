import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./features/deviceBLEconnection/BleContainer";
import VolcanoLoader from "./features/shared/OutletRenderer/VolcanoLoader";
import Volcano from "./features/deviceInteraction/DeviceInteraction";
import DeviceInformation from "./features/deviceInformation/DeviceInformation";
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

  const theme = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme()
  );

  useEffect(() => {
    document.body.style = `background: ${GetTheme(theme).backgroundColor};`;
  }, [theme]);

  return (
    <DndProvider backend={window.ontouchstart ? TouchBackend : HTML5Backend}>
      <ThemeProvider theme={GetTheme(theme)}>
        <Div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<BleConnectButtonContainer />} />
              <Route path="Volcano" element={<VolcanoLoader />}>
                <Route path="App" element={<Volcano />} />
                <Route
                  path="DeviceInformation"
                  element={<DeviceInformation />}
                />
                <Route path="Settings" element={<Settings />} />
                <Route path="WorkflowEditor" element={<WorkflowEditor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Div>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
