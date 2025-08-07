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
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const ModalSection = styled.div`
  background: ${(props) =>
    props.theme.settingsSectionBg || "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${(props) => props.theme.borderColor || "rgba(255, 255, 255, 0.1)"};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`;

const ModalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ModalSectionIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
`;

const ModalSectionTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.primaryColor || props.theme.primaryFontColor};
`;

const ModalDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${(props) => props.theme.primaryFontColor};
  opacity: 0.8;
`;

const InstructionText = styled.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.primaryFontColor};
  opacity: 0.7;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: ${(props) =>
    props.theme.buttonColorMain || "rgba(255, 255, 255, 0.05)"};
  border-radius: 4px;
  border-left: 3px solid
    ${(props) => props.theme.primaryColor || "rgba(255, 255, 255, 0.3)"};
`;

export default function AppendWorkflowConfigJson() {
  const { t } = useTranslation();
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
        <PrideText text={t("workflowEditor.appendWorkflowJSON")} />
      </Button>
      <ModalWrapper
        show={show}
        headerText={<PrideText text="📥 Import Additional Workflows" />}
        handleClose={handleClose}
        confirmButtonText={t("workflowButtons.addWorkflows")}
        handleConfirm={handleConfirm}
      >
        <ModalSection>
          <ModalSectionHeader>
            <ModalSectionIcon>ℹ️</ModalSectionIcon>
            <ModalSectionTitle>About Import</ModalSectionTitle>
          </ModalSectionHeader>
          <ModalDescription>
            Import workflows from JSON configuration files shared by others.
            These will be added to your existing workflows without replacing
            them.
          </ModalDescription>
        </ModalSection>

        <ModalSection>
          <ModalSectionHeader>
            <ModalSectionIcon>📝</ModalSectionIcon>
            <ModalSectionTitle>Paste Configuration</ModalSectionTitle>
          </ModalSectionHeader>
          <InstructionText>
            💡 Paste the workflow JSON configuration below. All workflows will
            be added to your current collection.
          </InstructionText>
          <ControlWrapper
            value={configString}
            onChange={(e) => setConfigString(e.target.value)}
            isValid={isValid}
            isInvalid={!isValid}
          />
          <Control.Feedback type="invalid">
            ❌ Invalid configuration format. Please check your JSON syntax.
          </Control.Feedback>
        </ModalSection>
      </ModalWrapper>
    </>
  );
}
