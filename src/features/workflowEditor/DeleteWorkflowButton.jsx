import { useSelector, useDispatch } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../services/utils";
import { useState } from "react";
import Button from "./shared/WorkflowFooterButtons";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import ModalWrapper from "../shared/styledComponents/Modal";
import PrideText from "../../themes/PrideText";

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
    handleClose();
  };

  return (
    <>
      <Button onClick={handleShow}>
        <PrideText text="Delete Workflow" />
      </Button>
      <ModalWrapper
        headerText={<PrideText text={`Delete Workflow "${props.name}"`} />}
        bodyText="Are you sure you want to delete this workflow? This action cannot be undone"
        confirmButtonText="Delete"
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        show={show}
      />
    </>
  );
}
