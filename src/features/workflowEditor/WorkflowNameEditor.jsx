import Label from "react-bootstrap/FormLabel";
import { useState } from "react";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import { useDispatch } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { useSelector } from "react-redux";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import WorkflowItemDiv from "./shared/WorkflowItemDiv";
import StyledControl from "../shared/styledComponents/FormControl";
import { useEffect } from "react";
import PrideText from "../../themes/PrideText";

export default function WorkflowNameEditor(props) {
  const [workflowName, setWorkflowName] = useState(props.name);
  const config = useSelector((state) => state.settings.config);
  const dispatch = useDispatch();
  const onBlur = (e) => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.find((r) => r.id === props.workflowId);
    workflow.name = workflowName;

    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
  };

  useEffect(() => {
    setWorkflowName(props.name);
  }, [props.name]);

  return (
    <WorkflowItemDiv>
      <Label><PrideText text="Workflow Name: " /></Label>
      <StyledControl
        type="text"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        onBlur={onBlur}
      />
    </WorkflowItemDiv>
  );
}
