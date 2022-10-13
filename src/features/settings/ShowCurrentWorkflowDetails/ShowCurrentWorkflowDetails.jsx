import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
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
    <Div>
      <h2>
        <PrideText text="Show details for executing workflow" />
      </h2>
      <div onClick={onChange}>
        <StyledToggleSwitch
          onText="On"
          offText={<PrideTextWithDiv text="Off" />}
          isToggleOn={showCurrentWorkflowDetails}
        />
      </div>
    </Div>
  );
}
