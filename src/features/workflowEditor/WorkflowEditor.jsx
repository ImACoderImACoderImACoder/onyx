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

const StyledAccordionBody = styled(Accordion.Body)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const WorkflowDiv = styled.div`
  display: flex;
  min-width: 85vw;
`;

const StyledAccordionHeader = styled(Accordion.Header)`
  .accordion-button {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.primaryFontColor};
  }
  .accordion-button:not(.collapsed) {
    color: ${(props) => props.theme.buttonActive.color};
    background-color: ${(props) => props.theme.borderColor};
    border-color: ${(props) => props.theme.buttonActive.borderColor};
  }
`;

const WorkflowButtonsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  width: 100vw;
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
        <Accordion.Item eventKey={`${item.id}`}>
          <StyledAccordionHeader onClick={() => onClick(`${item.id}`)}>
            {item.name}
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
        </Accordion.Item>
      </div>
    );
  });

  return (
    <Div>
      <h1>Workflow Editor</h1>
      <Accordion activeKey={currentAccordionId}>{workflowAccordions}</Accordion>
      <div style={{ display: "flex" }}>
        <CreateWorkflowButton onClick={onCreateWorkflow} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1>Config Editor</h1>
        {
          "Use this to backup existing workflows. Just save the text somewhere and you can paste it back in anytime. You can also add someone else's workflows to your workflows by pasting in the append workflow JSON modal"
        }
        <div style={{ display: "flex" }}>
          <WorkflowConfigEdtior />
          <AppendWorkflowConfigJson />
        </div>
      </div>
    </Div>
  );
}
