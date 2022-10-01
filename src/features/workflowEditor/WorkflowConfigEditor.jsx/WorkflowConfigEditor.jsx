import { useState } from "react";
import { useSelector } from "react-redux";
import WorkflowConfigValidator from "./workflowConfigValidator";
import ControlWrapper from "../../shared/styledComponents/FormControl";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import ModalWrapper from "../../shared/styledComponents/Modal";
import cloneDeep from "lodash/cloneDeep";
import Control from "react-bootstrap/FormControl";
import {
  setCurrentWorkflows,
  setFanOnGlobal,
} from "../../settings/settingsSlice";

import Button from "../shared/WorkflowFooterButtons";
import PrideText from "../../../themes/PrideText";
import { defaultGlobalFanOnTimeInSeconds } from "../../../constants/constants";

export default function WorkflowConfigEdtior() {
  const [show, setShow] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const dispatch = useDispatch();
  const workflowConfig = useSelector(
    (state) => state.settings.config.workflows
  );
  const [configString, setConfigString] = useState(
    JSON.stringify(workflowConfig)
  );

  const config = useSelector((state) => state.settings.config);

  const handleConfirm = () => {
    let uploadedConfig;
    try {
      uploadedConfig = JSON.parse(configString);
      if (!uploadedConfig.items) {
        uploadedConfig = {
          items: uploadedConfig,
          fanOnGlobal: defaultGlobalFanOnTimeInSeconds,
        };
      }
    } catch {
      setIsValid(false);
      return;
    }

    if (WorkflowConfigValidator(uploadedConfig)) {
      const newConfig = cloneDeep(config);
      newConfig.workflows = uploadedConfig;

      //instead of verifying ids its way easier to generate new ones
      newConfig.workflows.items.forEach((workflow, index) => {
        workflow.id = index + 1;
        workflow.payload.forEach((workflowItem, index) => {
          workflowItem.id = index + 1;
        });
      });

      WriteNewConfigToLocalStorage(newConfig);
      dispatch(setCurrentWorkflows([...newConfig.workflows.items]));
      dispatch(setFanOnGlobal(newConfig.workflows.fanOnGlobal));
      setIsValid(true);
      setShow(false);
    } else {
      setIsValid(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setConfigString(JSON.stringify(workflowConfig));
    setIsValid(true);
    setShow(true);
  };
  return (
    <>
      <Button onClick={handleShow}>
        <PrideText text="Edit/Copy Workflow JSON" />
      </Button>
      <ModalWrapper
        show={show}
        headerText={<PrideText text="Replace Workflow Config JSON" />}
        handleClose={handleClose}
        confirmButtonText="Save and Close"
        handleConfirm={handleConfirm}
      >
        <div>Paste Workflow JSON Below (use "[]" to make empty config)</div>
        <ControlWrapper
          value={configString}
          onChange={(e) => setConfigString(e.target.value)}
          isValid={isValid}
          isInvalid={!isValid}
        />

        <Control.Feedback type="invalid">{"Invalid Config"}</Control.Feedback>
      </ModalWrapper>
    </>
  );
}
