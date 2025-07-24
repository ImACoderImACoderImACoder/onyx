import styled from "styled-components";
import Accordion from "react-bootstrap/Accordion";
import WorkflowItemEditor from "./WorkflowItemEditor";
import CreateWorkflowButton from "./CreateWorkflowButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import DeleteWorkflowButton from "./DeleteWorkflowButton";
import CreateWorkflowItemButton from "./CreateWorkflowItemButton";
import WorkflowNameEditor from "./WorkflowNameEditor";
import Div from "../shared/styledComponents/RootNonAppOutletDiv";
import WorkflowConfigEdtior from "./WorkflowConfigEditor.jsx/WorkflowConfigEditor";
import AppendWorkflowConfigJson from "./WorkflowConfigEditor.jsx/AppendWorkflowConfigJson";
import Drag from "./DND/Drag";
import WorkflowDrop from "./DND/WorkflowDrop";
import WorkflowTips from "./WorkflowTips";
import PrideText from "../../themes/PrideText";
import Container from "react-bootstrap/Container";
import CreatePremadeWorkflowButtonContainer from "./CreatePremadeWorkflowButtonContainer";

const StyledAccordionBody = styled(Accordion.Body)`
  background-color: ${(props) => props.theme.backgroundColor};
`;

const WorkflowDiv = styled.div``;

const StyledAccordionHeader = styled(Accordion.Header)`
  .accordion-button {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.primaryFontColor};
  }
  .accordion-button:not(.collapsed) {
    color: ${(props) => props.theme.buttonActive.color};
    background-color: ${(props) =>
      props.theme.workflowEditor.accordianExpandedColor};
    border-color: ${(props) => props.theme.buttonActive.borderColor};
  }

  .accordion-button:not(.collapsed)::after {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${(
      props
    ) =>
      props.theme.backgroundColor.replace(
        "#",
        "%23"
      )}'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>");
  }

  .accordion-button::after {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${(
      props
    ) =>
      props.theme.iconColor.replace(
        "#",
        "%23"
      )}'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>");
  }
`;

const WorkflowButtonsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const ConfigEditorSection = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
  margin: 30px 0;
  transition: all 0.3s ease;
`;

const ConfigEditorHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ConfigDescription = styled.p`
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 12px 0 0 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ConfigButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const ConfigCard = styled.div`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ConfigCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ConfigCardIcon = styled.span`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const ConfigCardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primaryColor || props.theme.primaryFontColor};
`;

const ConfigCardDescription = styled.p`
  margin: 0 0 20px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
`;

const WorkflowCreationSection = styled.div`
  background: ${props => props.theme.settingsSectionBg || 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 24px;
  margin: 30px 0;
  transition: all 0.3s ease;
`;

const WorkflowCreationHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const WorkflowCreationDescription = styled.p`
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 12px 0 0 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const WorkflowCreationButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const WorkflowCreationCard = styled.div`
  background: ${props => props.theme.buttonColorMain || 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.theme.borderColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const WorkflowCreationCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const WorkflowCreationCardIcon = styled.span`
  font-size: 1.5rem;
  opacity: 0.8;
`;

const WorkflowCreationCardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primaryColor || props.theme.primaryFontColor};
`;

const WorkflowCreationCardDescription = styled.p`
  margin: 0 0 20px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${props => props.theme.primaryFontColor};
  opacity: 0.8;
`;

const AccordionItemWrapper = styled(Accordion.Item)`
  border-color: ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function WorkflowEditor() {
  const [currentAccordionId, setCurrentAccordionId] = useState("0");

  const workflows = useSelector(
    (state) => state.settings.config.workflows.items
  );
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );
  const currentWorkflowStepId = useSelector(
    (state) => state.workflow.currentWorkflowStepId
  );
  let currentWorkflowProgress = parseInt(
    (currentWorkflowStepId / currentWorkflow?.payload.length) * 100
  );

  if (isNaN(currentWorkflowProgress)) {
    currentWorkflowProgress = 0;
  }

  const workflowTestData = [...workflows];
  const onClick = (e) => {
    if (e === currentAccordionId) {
      setCurrentAccordionId(0);
    } else {
      setCurrentAccordionId(e);
    }
  };
  const onCreateWorkflow = (id) => {
    setCurrentAccordionId(`${id}`);
  };

  const workflowAccordions = workflowTestData.map((item, index) => {
    return (
      <div key={item.id}>
        <AccordionItemWrapper eventKey={`${item.id}`}>
          <StyledAccordionHeader onClick={() => onClick(`${item.id}`)}>
            <Drag
              onDrag={() => currentAccordionId > 0 && setCurrentAccordionId(0)}
              isSelected={item.id.toString() === currentAccordionId}
              key={item.id + index + item.name}
              itemId={item.id}
              itemName={item.name}
            >
              {<PrideText text={item.name} />}
            </Drag>
          </StyledAccordionHeader>
          <StyledAccordionBody>
            <WorkflowDiv>
              <WorkflowNameEditor workflowId={item.id} name={item.name} />
            </WorkflowDiv>
            {item.payload.map((workflowItem, index) => {
              return (
                <WorkflowDiv key={index}>
                  <WorkflowItemEditor
                    key={`${workflowItem.id}${index}`}
                    item={workflowItem}
                    workflowId={item.id}
                    itemIndex={index}
                    addDropZoneToTop={index === 0}
                  />
                </WorkflowDiv>
              );
            })}
            <WorkflowButtonsDiv>
              <CreateWorkflowItemButton id={item.id} />
              <DeleteWorkflowButton id={item.id} name={item.name} />
            </WorkflowButtonsDiv>
          </StyledAccordionBody>
        </AccordionItemWrapper>
        <WorkflowDrop key={item.id} itemId={item.id} />
      </div>
    );
  });

  return (
    <Div>
      <h1>
        <PrideText text="Workflow Editor" />
      </h1>
      <div style={{ display: "flex" }}>
        <WorkflowDrop itemId={0} />
      </div>
      <Accordion activeKey={currentAccordionId}>{workflowAccordions}</Accordion>
      <WorkflowCreationSection>
        <WorkflowCreationHeader>
          <h2>
            <PrideText text="➕ Create New Workflows" />
          </h2>
          <WorkflowCreationDescription>
            Start building your vaporizer routines by creating custom workflows or choosing from our premade templates.
          </WorkflowCreationDescription>
        </WorkflowCreationHeader>
        <WorkflowCreationButtonsContainer>
          <WorkflowCreationCard>
            <WorkflowCreationCardHeader>
              <WorkflowCreationCardIcon>🎨</WorkflowCreationCardIcon>
              <WorkflowCreationCardTitle>Custom Workflow</WorkflowCreationCardTitle>
            </WorkflowCreationCardHeader>
            <WorkflowCreationCardDescription>
              Build a workflow from scratch with your preferred temperature settings and timing.
            </WorkflowCreationCardDescription>
            <CreateWorkflowButton onClick={onCreateWorkflow} />
          </WorkflowCreationCard>
          <WorkflowCreationCard>
            <WorkflowCreationCardHeader>
              <WorkflowCreationCardIcon>📋</WorkflowCreationCardIcon>
              <WorkflowCreationCardTitle>Premade Templates</WorkflowCreationCardTitle>
            </WorkflowCreationCardHeader>
            <WorkflowCreationCardDescription>
              Quick start with expertly crafted workflows designed for different vaping styles.
            </WorkflowCreationCardDescription>
            <CreatePremadeWorkflowButtonContainer />
          </WorkflowCreationCard>
        </WorkflowCreationButtonsContainer>
      </WorkflowCreationSection>
      <Container></Container>
      <div style={{ marginTop: "20px" }}>
        <WorkflowTips />
      </div>
      <ConfigEditorSection>
        <ConfigEditorHeader>
          <h2>
            <PrideText text="⚙️ Config Editor" />
          </h2>
          <ConfigDescription>
            Backup and manage your workflow configurations. Export your workflows as JSON to save them, 
            or import configurations from others to expand your collection.
          </ConfigDescription>
        </ConfigEditorHeader>
        <ConfigButtonsContainer>
          <ConfigCard>
            <ConfigCardHeader>
              <ConfigCardIcon>📤</ConfigCardIcon>
              <ConfigCardTitle>Export & Edit</ConfigCardTitle>
            </ConfigCardHeader>
            <ConfigCardDescription>
              View and modify your current workflow configuration, or export it for backup.
            </ConfigCardDescription>
            <WorkflowConfigEdtior />
          </ConfigCard>
          <ConfigCard>
            <ConfigCardHeader>
              <ConfigCardIcon>📥</ConfigCardIcon>
              <ConfigCardTitle>Import Workflows</ConfigCardTitle>
            </ConfigCardHeader>
            <ConfigCardDescription>
              Add new workflows from JSON configuration files shared by others.
            </ConfigCardDescription>
            <AppendWorkflowConfigJson />
          </ConfigCard>
        </ConfigButtonsContainer>
      </ConfigEditorSection>
    </Div>
  );
}
