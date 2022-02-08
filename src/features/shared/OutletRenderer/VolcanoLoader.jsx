import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cacheContainsCharacteristic } from "../../../services/BleCharacteristicCache";
import { heatOffUuid } from "../../../constants/uuids";
import DisconnectButton from "./DisconnectButton";

import "./Volcano.css";
import ControlsIcon from "./icons/ControlsIcon";
import InformationIcon from "./icons/InformationIcon";
import SettingsIcon from "./icons/SettingsIcon";
import FOrCLoader from "../../settings/FOrC/FOrCLoader";
import { StyledRouterIconLink } from "./icons/Shared/IconLink";
import WorkflowEditorIcon from "./icons/WorkflowEditorIcon";

export default function VolcanoLoader(props) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const characteristic = cacheContainsCharacteristic(heatOffUuid);
    if (!characteristic) {
      navigate("/");
    }
  });
  const pageRoutes = [
    { displayText: "App", icon: <ControlsIcon />, route: "/Volcano/App" },
    {
      displayText: "Workflow Editor",
      icon: <WorkflowEditorIcon />,
      route: "/Volcano/WorkflowEditor",
    },
    {
      displayText: "Info",
      icon: <InformationIcon />,
      route: "/Volcano/DeviceInformation",
    },
    {
      displayText: "Settings",
      icon: <SettingsIcon />,
      route: "/Volcano/Settings",
    },
  ];

  const pageRoutesToBeRendered = pageRoutes.filter(
    (r) => r.route !== location.pathname
  );

  const iconLinks = pageRoutesToBeRendered.map((route) => (
    <StyledRouterIconLink key={route.route} to={route.route}>
      {route.icon}
      {route.displayText}
    </StyledRouterIconLink>
  ));

  return (
    cacheContainsCharacteristic(heatOffUuid) && (
      <div className="main-div">
        <FOrCLoader />
        <div className="disconnect-last-synced-div">
          {iconLinks}
          <DisconnectButton />
        </div>
        <Outlet {...props} />
      </div>
    )
  );
}
