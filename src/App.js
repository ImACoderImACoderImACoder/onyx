import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./components/BleConnection/BleContainer";
import VolcanoLoader from "./components/Volcano/VolcanoLoader";
import { clearCache } from "./services/BleCharacteristicCache";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
          <Route
            path="/"
            element={
              <BleConnectButtonContainer
                renderTimestamp={props.renderTimestamp}
              />
            }
          />
          <Route
            path="/Volcano"
            element={<VolcanoLoader renderTimestamp={props.renderTimestamp} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
