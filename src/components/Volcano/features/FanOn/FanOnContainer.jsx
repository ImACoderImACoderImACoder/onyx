import { useState, useEffect } from "react";
import { fanOnUuid, fanOffUuid } from "../../../../constants/uuids";
import { fanMask } from "../../../../constants/masks";
import FanOn from "./FanOn";
import {
  getToggleOnClick,
  initializeEffectForToggle,
} from "../Shared/HeatPumpSharedHandlers/heatPumpSharedCode";

export default function FanOnContainer(props) {
  const [isFanOn, setIsFanOn] = useState(false);

  useEffect(() => {
    initializeEffectForToggle(setIsFanOn, fanMask);
  }, [props.bleDevice]);

  const onClick = getToggleOnClick(isFanOn, setIsFanOn, fanOffUuid, fanOnUuid);

  return <FanOn onClick={onClick} isFanOn={isFanOn} />;
}
