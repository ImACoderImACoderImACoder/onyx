import Button from "../../shared/styledComponents/Button";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

const StyledModalBody = styled(Modal.Body)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalHeader = styled(Modal.Header)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalTitle = styled(Modal.Title)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalFooter = styled(Modal.Footer)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.primaryFontColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalButtons = styled(Button)`
  color: ${(props) => props.theme.primaryFontColor};
`;

export default function ModalWrapper(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <StyledModalHeader closeButton>
        <StyledModalTitle>{props.headerText}</StyledModalTitle>
      </StyledModalHeader>
      <StyledModalBody>{props.bodyText}</StyledModalBody>
      <StyledModalFooter>
        <StyledModalButtons onClick={props.handleClose}>
          Close
        </StyledModalButtons>
        <StyledModalButtons onClick={props.handleConfirm}>
          {props.confirmButtonText}
        </StyledModalButtons>
      </StyledModalFooter>
    </Modal>
  );
}
