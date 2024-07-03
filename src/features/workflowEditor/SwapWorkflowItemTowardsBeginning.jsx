import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import ArrowUpIcon from "../shared/OutletRenderer/icons/ArrowUpIcon";

export default function SwapWorkflowItemTowardsBeginning(props) {
  const config = useSelector((state) => state.settings.config);

  const dispatch = useDispatch();

  const onClick = () => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.items.find(
      (r) => r.id === props.workflowId
    );
    const indexToMove = workflow.payload.findIndex(
      (r) => r.id === props.workflowItemId
    );

    const temp = workflow.payload[indexToMove - 1];
    workflow.payload[indexToMove - 1] = workflow.payload[indexToMove];
    workflow.payload[indexToMove] = temp;

    workflow.payload.forEach((item, index) => (item.id = index + Date.now()));
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };

  const enterKeyCode = 13;
  const handler = (e) => {
    if (e.keyCode === enterKeyCode) {
      onClick();
    }
  };

  const showArrow =
    config.workflows.items
      .find((wf) => wf.id === props.workflowId)
      .payload.findIndex((item) => item.id === props.workflowItemId) > 0;
  return (
    <>
      {showArrow && (
        <ArrowUpIcon
          aria-label={`Move workflow item ${props.name} up`}
          onKeyUp={handler}
          tabIndex={0}
          onClick={onClick}
        />
      )}
    </>
  );
}
