import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import PrideText from "../../themes/PrideText";

const StyledDropdownButton = styled(Dropdown.Toggle)`
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 5px;
  border-color: ${(props) => props.theme.borderColor};
  min-height: 50px;
  border-style: ${(props) => props.theme.borderStyle};
  &:active {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
  &:hover {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
  &:focus {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
    border-color: ${(props) => props.theme.borderColor};
  }
`;

const StyledDropDownMenuItem = styled(Dropdown.Item)`
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 5px;
  border-color: ${(props) => props.theme.borderColor};
  border-style: ${(props) => props.theme.borderStyle};
  &:active {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
  &:hover {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
  }
  &:focus {
    background-color: ${(props) => props.theme.buttonActive.backgroundColor};
    color: ${(props) => props.theme.buttonActive.color};
    border-color: ${(props) => props.theme.borderColor};
  }
`;

const StyledDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${(props) => props.theme.buttonColorMain};
  color: ${(props) => props.theme.primaryFontColor};
  border-radius: 5px;
  border-color: ${(props) => props.theme.borderColor};
  border-style: ${(props) => props.theme.borderStyle};
  }
`;

const StyledDropdownDivider = styled(Dropdown.Divider)`
  background-color: ${(props) => props.theme.primaryFontColor}; ;
`;

export default function CreatePremadeWorkflowButton(props) {
  const onClick = (eventKey) => {
    const id = parseInt(eventKey);
    const newWorkflow = props.premadeWorkflows.filter(
      (item) => item.id === id
    )[0];
    props.onClick(newWorkflow);
  };

  return (
    <Dropdown onSelect={onClick}>
      <StyledDropdownButton
        variant="none"
        id="create-premade-workflows-dropdown"
      >
        <PrideText text="Create A Premade Workflow" />
      </StyledDropdownButton>

      <StyledDropDownMenu>
        {props.premadeWorkflows.map((premadeWorkflow, index) => {
          return (
            <>
              <StyledDropDownMenuItem
                key={premadeWorkflow.id}
                eventKey={premadeWorkflow.id}
              >
                {<PrideText text={premadeWorkflow.name} />}
              </StyledDropDownMenuItem>
              {props.premadeWorkflows.length - 1 !== index && (
                <StyledDropdownDivider />
              )}
            </>
          );
        })}
      </StyledDropDownMenu>
    </Dropdown>
  );
}
