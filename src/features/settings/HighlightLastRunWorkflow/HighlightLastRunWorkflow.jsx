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
import { useTranslation } from "react-i18next";

export default function HighlightLastRunWorkflow() {
  const { t } = useTranslation();
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
      title={t('settings.items.highlightLastRunWorkflow.title')}
      description={t('settings.items.highlightLastRunWorkflow.description')}
    >
      <StyledToggleSwitch
        onText={t('common.on')}
        offText={<PrideTextWithDiv text={t('common.off')} />}
        isToggleOn={highlightLastRunWorkflow}
        onChange={onChange}
      />
    </SettingsItem>
  );
}
