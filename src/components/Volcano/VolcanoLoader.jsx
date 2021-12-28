import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cacheContainsCharacteristic } from "../../services/BleCharacteristicCache";
import { heatOffUuid } from "../../constants/uuids";
import DisconnectButton from "./DisconnectButton";

import "./Volcano.css";
import FOrC from "./features/FOrC/FOrCContainer";
import ControlsIcon from "./icons/ControlsIcon";
import InformationIcon from "./icons/InformationIcon";
import SettingsIcon from "./icons/SettingsIcon";
export default function VolcanoLoader(props) {
  const navigate = useNavigate();
  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });

  return (
    cacheContainsCharacteristic(heatOffUuid) && (
      <div className="main-div">
        <div style={{ display: "none" }}>
          {
            //this is a cool little hack to get the events bound that this component registers
          }
          <FOrC />
        </div>
        <div className="disconnect-last-synced-div">
          <Link className="icon-links" to={"/Volcano/App"}>
            <ControlsIcon />
            App
          </Link>
          <Link className="icon-links" to={"/Volcano/DeviceInformation"}>
            <InformationIcon />
            Device Info
          </Link>
          <Link className="icon-links" to={"/Volcano/Settings"}>
            <SettingsIcon />
            Settings
          </Link>
          <DisconnectButton />
        </div>
        <Outlet {...props} />
      </div>
    )
  );
}
