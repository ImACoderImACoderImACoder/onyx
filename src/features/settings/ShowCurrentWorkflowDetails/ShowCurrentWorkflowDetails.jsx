import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import SettingsItem from "../SettingsItem";
import { PrideTextWithDiv } from "../../../themes/PrideText";
import { useDispatch } from "react-redux";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";
import { setShowCurrentWorkflowDetails } from "../settingsSlice";

export default function ShowCurrentWorkflowDetails() {
  const dispatch = useDispatch();
  const showCurrentWorkflowDetails = useSelector(
    (state) => state.settings.config.showCurrentWorkflowDetails
  );

  const onChange = () => {
    const config = ReadConfigFromLocalStorage();
    config.showCurrentWorkflowDetails = !showCurrentWorkflowDetails;
    WriteNewConfigToLocalStorage(config);
    dispatch(setShowCurrentWorkflowDetails(!showCurrentWorkflowDetails));
  };

  return (
    <SettingsItem
      title="Show Active Workflow Step"
      description="Display the currently executing workflow step in the workflow editor for real-time tracking."
    >
      <StyledToggleSwitch
        onText="On"
        offText={<PrideTextWithDiv text="Off" />}
        isToggleOn={showCurrentWorkflowDetails}
        onChange={onChange}
      />
    </SettingsItem>
  );
}
