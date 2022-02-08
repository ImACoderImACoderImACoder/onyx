import { useDispatch, useSelector } from "react-redux";
import { WriteNewConfigToLocalStorage } from "../../../services/utils";
import { setTemperatureControls } from "../settingsSlice";
import { defaultTemperatureArray } from "../../../constants/constants";
import { useState } from "react";
import ModalWrapper from "../../shared/styledComponents/Modal";
import Button from "../../shared/styledComponents/Button";

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
      <Button onClick={handleShow}>Restore Defaults</Button>
      <ModalWrapper
        headerText="Restore Default Temperatures"
        bodyText="Are you sure you want to restore defaults? This action cannot be undone"
        confirmButtonText="Save Changes"
        handleClose={handleClose}
        handleConfirm={handleSave}
        show={show}
      />
    </>
  );
}
