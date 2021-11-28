import { useState, useEffect } from "react";
import { heatOnUuid, heatOffUuid } from "../../../../constants/uuids";
import { heatingMask } from "../../../../constants/masks";
import HeatOn from "./HeatOn";
import {
  getToggleOnClick,
  initializeEffectForToggle,
} from "../Shared/HeatPumpSharedHandlers/heatPumpSharedCode";
import debounce from "lodash/debounce";
import { bleDebounceTime } from "../../../../constants/constants";

export default function HeatOnContainer(props) {
  const [isHeatOn, setIsHeatOn] = useState(false);

  //since the heat and air buttons share code this event will sync the fan changes too
  //that worked coincidentally and it was throwing me off when testing since I did not expect that
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        initializeEffectForToggle(setIsHeatOn, heatingMask);
      }
    };
    document.addEventListener("visibilitychange", handler);

    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  });

  useEffect(() => {
    initializeEffectForToggle(setIsHeatOn, heatingMask);
  }, []);

  const blePayloadDebounce = debounce(
    getToggleOnClick(isHeatOn, setIsHeatOn, heatOffUuid, heatOnUuid),
    bleDebounceTime,
    { isHeatOn }
  );

  const onChange = (checked) => {
    if (checked === isHeatOn) {
      console.log("Heat skipped spam click");
    } else {
      blePayloadDebounce();
    }
  };

  return <HeatOn onChange={onChange} isHeatOn={isHeatOn} />;
}
