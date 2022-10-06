import { useState } from "react";
import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";

export default function TurnHeatOnWhenConnectionIsEstablished() {
  const [onConnectTurnHeatOn, setOnConnectTurnHeatOn] = useState(
    useSelector((state) => state.settings.config.onConnectTurnHeatOn)
  );

  const onChange = () => {
    setOnConnectTurnHeatOn((prevState) => {
      const config = ReadConfigFromLocalStorage();
      config.onConnectTurnHeatOn = !prevState;
      WriteNewConfigToLocalStorage(config);
      return !prevState;
    });
  };

  return (
    <Div>
      <h2>
        <PrideText text="Automatically turn on heat when connecting to the Volcano" />
      </h2>
      <div onClick={onChange}>
        <StyledToggleSwitch
          onText="On"
          offText={<PrideTextWithDiv text="Off" />}
          isToggleOn={onConnectTurnHeatOn}
        />
      </div>
    </Div>
  );
}
