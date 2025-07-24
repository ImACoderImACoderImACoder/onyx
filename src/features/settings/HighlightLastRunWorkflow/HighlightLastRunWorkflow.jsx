import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
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
    <SettingsItem
      title="Highlight Recent Workflow"
      description="Visually highlight the most recently executed workflow on the app controls screen."
    >
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={highlightLastRunWorkflow}
        onChange={onChange}
      />
    </SettingsItem>
  );
}
