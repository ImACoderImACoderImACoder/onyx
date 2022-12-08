import CreatePremadeWorkflowButton from "./CreatePremadeWorkflowButton";
import { premadeWorkflows } from "../../constants/constants";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import cloneDeep from "lodash/cloneDeep";

export default function CreatePremadeWorkflowButtonContainer() {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();

  const addWorkflowItemToConfig = (workflow) => {
    const newWorkflow = { ...workflow, id: Date.now() };
    const newConfig = cloneDeep(config);

    newConfig.workflows.items.push(newWorkflow);

    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };
  return (
    <CreatePremadeWorkflowButton
      premadeWorkflows={premadeWorkflows}
      onClick={addWorkflowItemToConfig}
    />
  );
}
