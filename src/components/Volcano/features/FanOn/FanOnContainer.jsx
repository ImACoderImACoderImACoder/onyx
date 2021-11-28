import { useState, useEffect } from "react";
import { fanOnUuid, fanOffUuid } from "../../../../constants/uuids";
import { fanMask } from "../../../../constants/masks";
import FanOn from "./FanOn";
import {
  getToggleOnClick,
  initializeEffectForToggle,
} from "../Shared/HeatPumpSharedHandlers/heatPumpSharedCode";
import debounce from "lodash/debounce";
import { bleDebounceTime } from "../../../../constants/constants";

export default function FanOnContainer(props) {
  const [isFanOn, setIsFanOn] = useState(false);

  useEffect(() => {
    initializeEffectForToggle(setIsFanOn, fanMask);
  }, []);

  const blePayloadDebounce = debounce(
    getToggleOnClick(isFanOn, setIsFanOn, fanOffUuid, fanOnUuid),
    bleDebounceTime,
    { isFanOn }
  );

  const onChange = (checked) => {
    if (checked === isFanOn) {
      console.log("Fan skipped spam click");
    } else {
      blePayloadDebounce();
    }
  };

  return <FanOn onChange={onChange} isFanOn={isFanOn} />;
}
