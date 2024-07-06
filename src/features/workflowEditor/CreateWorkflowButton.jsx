import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import Button from "./shared/WorkflowFooterButtons";
import styled from "styled-components";
import PrideText from "../../themes/PrideText";
const StyledButton = styled(Button)`
  width: fit-content;
  margin-top: 0px;
`;
export default function CreateWorkflowButton(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const createWorkflow = () => {
    const nextId = config.workflows.items.length
      ? config.workflows.items[config.workflows.items.length - 1].id + 1
      : 1;
    const newConfig = cloneDeep(config);

    newConfig.workflows.items.push({
      id: nextId,
      name: `New Workflow ${nextId}`,
      payload: [],
    });
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
    props.onClick(nextId);
  };

  return (
    <StyledButton onClick={createWorkflow}>
      <PrideText text="Create New Workflow" />
    </StyledButton>
  );
}
