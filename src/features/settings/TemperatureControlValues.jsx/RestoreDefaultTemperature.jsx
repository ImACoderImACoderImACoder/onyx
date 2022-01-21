import Button from "../../shared/styledComponents/Button";
import { useDispatch, useSelector } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { setTemperatureControls } from "../settingsSlice";
import { defaultTemperatureArray } from "../../../constants/constants";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import styled from "styled-components";

const StyledModalBody = styled(Modal.Body)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.settingsPageColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalHeader = styled(Modal.Header)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.settingsPageColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalTitle = styled(Modal.Title)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.settingsPageColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledModalFooter = styled(Modal.Footer)`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.settingsPageColor};
  border-color: ${(props) => props.theme.borderColor};
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme.settingsPageColor};
`;

export default function RestoreDefaultTemperature() {
  const [show, setShow] = useState(false);
  const config = useSelector((state) => state.settings.config);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };
  const dispatch = useDispatch();

  const resetConfigToDefaultTemperatures = () => {
    WriteNewConfigToLocalStorage({
      ...config,
      temperatureControlValues: [...defaultTemperatureArray],
    });
    dispatch(setTemperatureControls([...defaultTemperatureArray]));
  };
  const handleSave = () => {
    handleClose();
    resetConfigToDefaultTemperatures();
  };
  return (
    <>
      <StyledButton onClick={handleShow}>Restore Defaults</StyledButton>

      <Modal show={show} onHide={handleClose}>
        <StyledModalHeader closeButton>
          <StyledModalTitle>Restore Default Temperatures</StyledModalTitle>
        </StyledModalHeader>
        <StyledModalBody>
          Are you sure you want to restore defaults? This action cannot be
          undone
        </StyledModalBody>
        <StyledModalFooter>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </StyledModalFooter>
      </Modal>
    </>
  );
}
