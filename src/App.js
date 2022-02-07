import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./components/BleConnection/BleContainer";
import VolcanoLoader from "./components/Volcano/VolcanoLoader";
import Volcano from "./components/Volcano/Volcano";
import DeviceInformation from "./features/deviceInformation/DeviceInformation";
import { clearCache } from "./services/BleCharacteristicCache";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Settings from "./features/settings/Settings";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import GetTheme from "./themes/ThemeProvider";
import WorkflowEditor from "./features/workflowEditor/WorkflowEditor";
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
    <ThemeProvider theme={GetTheme(theme)}>
      <Div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BleConnectButtonContainer />} />
            <Route path="Volcano" element={<VolcanoLoader />}>
              <Route path="App" element={<Volcano />} />
              <Route path="DeviceInformation" element={<DeviceInformation />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="WorkflowEditor" element={<WorkflowEditor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Div>
    </ThemeProvider>
  );
}

export default App;
