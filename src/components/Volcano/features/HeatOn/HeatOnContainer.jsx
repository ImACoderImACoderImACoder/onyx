import { useState, useEffect } from "react";
import { heatOnUuid, heatOffUuid } from "../../../../constants/uuids";
import { heatingMask } from "../../../../constants/masks";
import HeatOn from "./HeatOn";
import {
  getToggleOnClick,
  initializeEffectForToggle,
} from "../Shared/HeatPumpSharedHandlers/heatPumpSharedCode";

export default function HeatOnContainer(props) {
  const [isHeatOn, setIsHeatOn] = useState(false);

  useEffect(() => {
    initializeEffectForToggle(setIsHeatOn, heatingMask);
  }, []);

  const onClick = getToggleOnClick(
    isHeatOn,
    setIsHeatOn,
    heatOffUuid,
    heatOnUuid
  );

  return <HeatOn onClick={onClick} isHeatOn={isHeatOn} />;
}
