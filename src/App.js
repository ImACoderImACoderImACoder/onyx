import { BrowserRouter, Routes, Route } from "react-router-dom";
import BleConnectButtonContainer from "./components/BleConnection/BleContainer";
import VolcanoLoader from "./components/Volcano/VolcanoLoader";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BleConnectButtonContainer />} />
        <Route path="/Volcano" element={<VolcanoLoader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
