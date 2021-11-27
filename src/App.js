import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./components/BleConnection/BleContainer";
import VolcanoLoader from "./components/Volcano/VolcanoLoader";
import "./App.css";

function App(props) {
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
