import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";

interface DisplayOnCoolingToggleProps {
  onChange: () => void;
  isDisplayOnCooling: boolean;
}

export default function DisplayOnCoolingToggle({
  onChange,
  isDisplayOnCooling,
}: DisplayOnCoolingToggleProps) {
  return (
    <Div>
      <h2>
        <PrideText text="Volcano shows temperature when the heat is turned off" />
      </h2>
      <div onClick={onChange}>
        <StyledToggleSwitch
          onText="On"
          offText={<PrideTextWithDiv text="Off" />}
          isToggleOn={isDisplayOnCooling}
        />
      </div>
    </Div>
  );
}
