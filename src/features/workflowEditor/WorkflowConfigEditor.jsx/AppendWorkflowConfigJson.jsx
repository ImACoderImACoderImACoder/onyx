import { useState } from "react";
import { useSelector } from "react-redux";
import WorkflowConfigValidator from "./workflowConfigValidator";
import ControlWrapper from "../../shared/styledComponents/FormControl";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { useDispatch } from "react-redux";
import ModalWrapper from "../../shared/styledComponents/Modal";
import cloneDeep from "lodash/cloneDeep";
import Control from "react-bootstrap/FormControl";
import { setCurrentWorkflows } from "../../settings/settingsSlice";

import Button from "../shared/WorkflowFooterButtons";
import PrideText from "../../../themes/PrideText";
import { defaultGlobalFanOnTimeInSeconds } from "../../../constants/constants";

export default function AppendWorkflowConfigJson() {
  const [show, setShow] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const dispatch = useDispatch();

  const [configString, setConfigString] = useState("");

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
      for (let i = 0; i < uploadedConfig.items.length; i++) {
        newConfig.workflows.items.push(uploadedConfig.items[i]);
      }

      //instead of verifying ids its way easier to generate new ones
      newConfig.workflows.items.forEach((workflow, index) => {
        workflow.id = index + 1;
        workflow.payload.forEach((workflowItem, index) => {
          workflowItem.id = index + 1;
        });
      });

      WriteNewConfigToLocalStorage(newConfig);
      dispatch(setCurrentWorkflows(newConfig.workflows.items));
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
    setConfigString("");
    setIsValid(true);
    setShow(true);
  };

  return (
    <>
      <Button onClick={handleShow}>
        <PrideText text="Append Workflow JSON" />
      </Button>
      <ModalWrapper
        show={show}
        headerText={
          <PrideText text="Append Workflow Config JSON to Current Config" />
        }
        handleClose={handleClose}
        confirmButtonText="Save and Close"
        handleConfirm={handleConfirm}
      >
        <div>Paste Workflow JSON Below</div>
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
