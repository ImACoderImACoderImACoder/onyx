import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./components/BleConnection/BleContainer";
import VolcanoLoader from "./components/Volcano/VolcanoLoader";
import Ble from "./services/bluetooth";

function App() {
  const [bleDevice, setBleDevice] = useState(undefined);

  const onBleConnectClick = () => {
    Promise.resolve()
      .then(() => Ble)
      .then((bleDevice) => {
        console.log(`setting ble device to ${bleDevice}`);
        setBleDevice(bleDevice);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <BleConnectButtonContainer
              isBluetoothConnected={bleDevice}
              onClick={onBleConnectClick}
            />
          }
        />
        <Route
          path="/Volcano"
          element={
            <VolcanoLoader bleDevice={bleDevice} setBleDevice={setBleDevice} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
