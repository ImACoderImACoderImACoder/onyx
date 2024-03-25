import { useSelector } from "react-redux";
import StyledToggleSwitch from "../Shared/StyledComponents/StyledToggleDiv";
import Div from "../Shared/StyledComponents/Div";
import PrideText, { PrideTextWithDiv } from "../../../themes/PrideText";
import { useDispatch } from "react-redux";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../../services/utils";
import { setShowSessionCount } from "../settingsSlice";

export default function ShowCurrentSessionCountInMenuBar() {
  const dispatch = useDispatch();
  const showSessionCount = useSelector(
    (state) => state.settings.config.showSessionCount
  );

  const onChange = () => {
    const config = ReadConfigFromLocalStorage();
    config.showSessionCount = !showSessionCount;
    WriteNewConfigToLocalStorage(config);
    dispatch(setShowSessionCount(!showSessionCount));
  };

  return (
    <Div>
      <h2>
        <PrideText text="Show session count" />
      </h2>
      <div onClick={onChange}>
        <StyledToggleSwitch
          onText="On"
          offText={<PrideTextWithDiv text="Off" />}
          isToggleOn={showSessionCount}
        />
      </div>
    </Div>
  );
}
