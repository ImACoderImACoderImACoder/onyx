import Button from "./shared/WorkflowFooterButtons";
import { ClearWorkflowQueue } from "../../services/bleQueueing";
import { setCurrentWorkflow, setCurrentWorkflowStepId } from "./workflowSlice";
import { useDispatch } from "react-redux";

export default function CancelCurrentWorkflow() {
  const dispatch = useDispatch();

  const onClick = () => {
    ClearWorkflowQueue();
    dispatch(setCurrentWorkflowStepId());
    dispatch(setCurrentWorkflow());
  };

  return <Button onClick={onClick}>Cancel Active Workflow</Button>;
}
