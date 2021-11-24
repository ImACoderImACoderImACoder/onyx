import { useState, useEffect } from "react";
import { heatOnUuid, heatOffUuid } from "../../../../constants/uuids";
import { heatingMask } from "../../../../constants/masks";
import HeatOn from "./HeatOn";
import {
  getToggleOnClick,
  initializeEffectForToggle,
} from "../../../../services/utils";

export default function HeatOnContainer(props) {
  const [isHeatOn, setIsHeatOn] = useState(false);

  useEffect(() => {
    initializeEffectForToggle(props.bleDevice, setIsHeatOn, heatingMask);
  }, [props.bleDevice]);

  const onClick = getToggleOnClick(
    props.bleDevice,
    isHeatOn,
    setIsHeatOn,
    heatOffUuid,
    heatOnUuid
  );

  return <HeatOn onClick={onClick} isHeatOn={isHeatOn} />;
}
