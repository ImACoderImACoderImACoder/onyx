import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { setTemperatureControls } from "../settingsSlice";
import { defaultTemperatureArray } from "../../../constants/constants";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

export default function RestoreDefaultTemperature() {
  const [show, setShow] = useState(false);
  const config = useSelector((state) => state.settings.config);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();

  const resetConfigToDefaultTemperatures = () => {
    WriteNewConfigToLocalStorage({
      ...config,
      temperatureControlValues: defaultTemperatureArray,
    });
    dispatch(setTemperatureControls(defaultTemperatureArray));
  };
  const handleSave = () => {
    handleClose();
    resetConfigToDefaultTemperatures();
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Restore Defaults
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Restore Default Temperatures</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to restore defaults? This action cannot be
          undone
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
