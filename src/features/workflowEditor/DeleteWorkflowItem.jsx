import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import styled from "styled-components";
import cloneDeep from "lodash/cloneDeep";
import { useState } from "react";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import DeleteIcon from "../shared/OutletRenderer/icons/DeleteIcon";
import ModalWrapper from "../shared/styledComponents/Modal";

const StyledDeleteIcon = styled(DeleteIcon)`
  margin-left: 0px;
  margin-right: 0px;
`;

export default function DeleteWorkflowItem(props) {
  const config = useSelector((state) => state.settings.config);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };
  const dispatch = useDispatch();

  const handleConfirm = () => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.find((r) => r.id === props.workflowId);
    const indexToRemove = workflow.payload.findIndex(
      (r) => r.id === props.workflowItemId
    );

    workflow.payload.splice(indexToRemove, 1);
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
  };

  return (
    <>
      <StyledDeleteIcon onClick={handleShow} />
      <ModalWrapper
        headerText={`Delete "${props.name}"`}
        bodyText="Are you sure you want to delete this workflow item? This action cannot be undone"
        confirmButtonText="Delete"
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        show={show}
      />
    </>
  );
}
