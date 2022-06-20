import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import Button from "./shared/WorkflowFooterButtons";
import styled from "styled-components";
import PrideText from "../../themes/PrideText";
const StyledButton = styled(Button)`
  max-width: none;
`;
export default function CreateWorkflowButton(props) {
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const createWorkflow = () => {
    const nextId = config.workflows.length
      ? config.workflows[config.workflows.length - 1].id + 1
      : 1;
    const newConfig = cloneDeep(config);

    newConfig.workflows.push({
      id: nextId,
      name: `New Workflow ${nextId}`,
      payload: [],
    });
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
    props.onClick(nextId);
  };

  return (
    <StyledButton onClick={createWorkflow}><PrideText text="Create New Workflow"/></StyledButton>
  );
}
