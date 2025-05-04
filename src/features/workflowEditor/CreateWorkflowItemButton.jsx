import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import Button from "./shared/WorkflowFooterButtons";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import { WorkflowItemTypes } from "../../constants/enums";
import PrideText from "../../themes/PrideText";

export default function CreateWorkflowItemButton(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const onClick = () => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.items.find((r) => r.id === props.id);
    const nextId = workflow.payload.length + 1;
    workflow.payload.push({
      type: WorkflowItemTypes.HEAT_OFF,
      id: nextId,
    });
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };

  return (
    <Button onClick={onClick}>
      <PrideText text="Add Action" />
    </Button>
  );
}
