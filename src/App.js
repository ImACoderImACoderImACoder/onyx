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

function App(props) {
  useEffect(() => {
    window.onunhandledrejection = (event) => {
      console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
      clearCache();
    };
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BleConnectButtonContainer />} />
          <Route path="Volcano" element={<VolcanoLoader />}>
            <Route path="App" element={<Volcano />} />
            <Route path="DeviceInformation" element={<DeviceInformation />} />
            <Route path="Settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
