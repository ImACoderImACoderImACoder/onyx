import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import { useState } from "react";
import styled from "styled-components";
import Button from "../shared/styledComponents/Button";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import ModalWrapper from "../shared/styledComponents/Modal";

const StyledButton = styled(Button)`
  min-height: 50px;
  margin-top: 15px;
  color: ${(props) => props.theme.settingsPageColor};
`;

export default function DeleteWorkflowButton(props) {
  const [show, setShow] = useState(false);
  const config = useSelector((state) => state.settings.config);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const dispatch = useDispatch();
  const handleConfirm = () => {
    const newConfig = cloneDeep(config);
    const indexToBeDelete = newConfig.workflows.findIndex(
      (r) => r.id === props.id
    );
    newConfig.workflows.splice(indexToBeDelete, 1);
    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows));
  };

  return (
    <>
      <StyledButton onClick={handleShow}>Delete Workflow</StyledButton>
      <ModalWrapper
        headerText={`Delete Workflow "${props.name}"`}
        bodyText="Are you sure you want to delete this workflow? This action cannot be undone"
        confirmButtonText="Delete"
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        show={show}
      />
    </>
  );
}
