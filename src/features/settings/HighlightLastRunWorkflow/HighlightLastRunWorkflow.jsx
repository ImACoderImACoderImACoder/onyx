import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import { useDispatch } from "react-redux";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";
import { setHighlightLastRunWorkflow } from "../settingsSlice";

export default function HighlightLastRunWorkflow() {
  const dispatch = useDispatch();
  const highlightLastRunWorkflow = useSelector(
    (state) => state.settings.config.highlightLastRunWorkflow
  );

  const onChange = () => {
    const config = ReadConfigFromLocalStorage();
    config.highlightLastRunWorkflow = !highlightLastRunWorkflow;
    WriteNewConfigToLocalStorage(config);
    dispatch(setHighlightLastRunWorkflow(!highlightLastRunWorkflow));
  };

  return (
    <Div>
      <h2>
        <PrideText text="Highlight last run workflow" />
      </h2>
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={highlightLastRunWorkflow}
        onChange={onChange}
      />
    </Div>
  );
}
