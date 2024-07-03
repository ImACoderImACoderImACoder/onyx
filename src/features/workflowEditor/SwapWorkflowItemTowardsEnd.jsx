import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import ArrowUpIcon from "../shared/OutletRenderer/icons/ArrowUpIcon";

import styled from "styled-components";

const ArrowDownIcon = styled(ArrowUpIcon)`
  transition: transform 0.5s;
  transform: rotate(180deg);
`;
export default function SwapWorkflowItemTowardsEnd(props) {
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

    const temp = workflow.payload[indexToMove + 1];
    workflow.payload[indexToMove + 1] = workflow.payload[indexToMove];
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

  const workflow = config.workflows.items.find(
    (wf) => wf.id === props.workflowId
  );

  const showArrow =
    workflow.payload.findIndex((item) => item.id === props.workflowItemId) <
    workflow.payload.length - 1;

  return (
    <>
      {showArrow && (
        <ArrowDownIcon
          aria-label={`Delete workflow item ${props.name}`}
          onKeyUp={handler}
          tabIndex={0}
          onClick={onClick}
        />
      )}
    </>
  );
}
