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
`;

const WorkflowButtonsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const AccordionItemWrapper = styled(Accordion.Item)`
  border-color: ${(props) => props.theme.borderColor};
`;

export default function WorkflowEditor() {
  const [currentAccordionId, setCurrentAccordionId] = useState("0");

  const workflows = useSelector((state) => state.settings.config.workflows);
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

  const workflowAccordions = workflowTestData.map((item) => {
    return (
      <div key={item.id}>
        <AccordionItemWrapper eventKey={`${item.id}`}>
          <StyledAccordionHeader onClick={() => onClick(`${item.id}`)}>
            <Drag
              onDrag={() => setCurrentAccordionId(0)}
              key={item.id}
              itemId={item.id}
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
                    key={workflowItem.id}
                    item={workflowItem}
                    workflowId={item.id}
                    itemIndex={index}
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
      <div style={{ display: "flex" }}>
        <CreateWorkflowButton onClick={onCreateWorkflow} />
      </div>
      <Container></Container>
      <div style={{ marginTop: "20px" }}>
        <WorkflowTips />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>
          <PrideText text="Config Editor" />
        </h2>
        {
          "Use this to backup existing workflows. Just save the text somewhere and you can paste it back in anytime. You can also add someone else's workflows to your workflows by pasting in the append workflow JSON modal"
        }
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <WorkflowConfigEdtior />
          <AppendWorkflowConfigJson />
        </div>
      </div>
    </Div>
  );
}
