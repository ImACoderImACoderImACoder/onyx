import { useState } from "react";
import PrideText from "../../themes/PrideText";
import Button from "../shared/styledComponents/Button";
import StyledControl from "../shared/styledComponents/FormControl";
import { StyledLabel } from "./WorkflowItemEditor";
import { Col, Form, Row } from "react-bootstrap";
import ModalWrapper from "../shared/styledComponents/Modal";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../shared/OutletRenderer/icons/DeleteIcon";

const MIN_CELSIUS_TEMP = 150;

export default function HeatSettingsForm() {
  const [data, setData] = useState({
    default: {
      temp: MIN_CELSIUS_TEMP,
      wait: 5,
    },
    conditions: [{ ifTemp: MIN_CELSIUS_TEMP, nextTemp: 180, wait: 5 }],
  });

  const [errors, setErrors] = useState({ default: {}, conditions: {} });

  const [show, setShow] = useState(false);
  const config = useSelector((state) => state.settings.config);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const dispatch = useDispatch();
  const handleConfirm = () => {
    return;
  };

  const handleDefaultBlur = (field) => (e) => {
    const value = parseInt(e.target.value, 10);
    //you need to do validation for time and temp separatlye
    if (isNaN(value) || value < MIN_CELSIUS_TEMP) {
      setErrors((prev) => ({
        ...prev,
        default: {
          ...prev.default,
          [field]: `Must be a positive number greater than ${MIN_CELSIUS_TEMP}`,
        },
      }));
      return;
    }

    setData((prev) => ({
      ...prev,
      default: {
        ...prev.default,
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      default: { ...prev.default, [field]: null },
    }));
  };

  const handleConditionBlur = (index, field) => (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
      setErrors((prev) => {
        const newErrors = { ...prev.conditions };
        newErrors[index] = {
          ...(newErrors[index] || {}),
          [field]: "Must be a positive number",
        };
        return { ...prev, conditions: newErrors };
      });
      return;
    }

    setData((prev) => {
      const newConditions = [...prev.conditions];
      newConditions[index] = { ...newConditions[index], [field]: value };
      return { ...prev, conditions: newConditions };
    });

    setErrors((prev) => {
      const newErrors = { ...prev.conditions };
      if (newErrors[index]) {
        newErrors[index][field] = null;
      }
      return { ...prev, conditions: newErrors };
    });
  };

  const addHeatCondition = () => {
    setData((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { ifTemp: MIN_CELSIUS_TEMP, nextTemp: MIN_CELSIUS_TEMP, wait: 5 },
      ],
    }));
  };

  const handler = (e) => {
    if (e.keyCode === enterKeyCode) {
      handleShow(e);
    }
  };
  return (
    <>
      <h4>Default Settings</h4>
      <Row className="mb-3">
        <Col>
          <StyledLabel>Default Temp</StyledLabel>
          <StyledControl
            type="number"
            defaultValue={data.default.temp}
            onBlur={handleDefaultBlur("temp")}
            isInvalid={!!errors.default.temp}
          />
          {errors.default.temp && (
            <div className="text-danger small mt-1">{errors.default.temp}</div>
          )}
        </Col>
        <Col>
          <StyledLabel>Default Wait</StyledLabel>
          <StyledControl
            type="number"
            defaultValue={data.default.wait}
            onBlur={handleDefaultBlur("wait")}
            isInvalid={!!errors.default.wait}
          />
          {errors.default.wait && (
            <div className="text-danger small mt-1">{errors.default.wait}</div>
          )}
        </Col>
      </Row>

      <hr className="my-4" />

      <h4>Heat Conditions</h4>
      {data.conditions.map((cond, idx) => (
        <Row className="mb-3" key={idx}>
          <Col>
            <StyledLabel>If Temp</StyledLabel>
            <StyledControl
              type="number"
              defaultValue={cond.ifTemp}
              onBlur={handleConditionBlur(idx, "ifTemp")}
              isInvalid={!!errors.conditions[idx]?.ifTemp}
            />
            <StyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.ifTemp}
            </StyledControl.Feedback>
          </Col>
          <Col>
            <StyledLabel>Next Temp</StyledLabel>
            <StyledControl
              type="number"
              defaultValue={cond.nextTemp}
              onBlur={handleConditionBlur(idx, "nextTemp")}
              isInvalid={!!errors.conditions[idx]?.nextTemp}
            />
            <StyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.nextTemp}
            </StyledControl.Feedback>
          </Col>
          <Col>
            <StyledLabel>Wait</StyledLabel>
            <StyledControl
              type="number"
              defaultValue={cond.wait}
              onBlur={handleConditionBlur(idx, "wait")}
              isInvalid={!!errors.conditions[idx]?.wait}
            />
            <StyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.wait}
            </StyledControl.Feedback>
          </Col>
          <Col>
            <StyledLabel>Delete</StyledLabel>
            <DeleteIcon
              aria-label={`Delete conditional heat item`}
              onKeyDown={handler}
              tabIndex={0}
              onClick={handleShow}
            />
            <ModalWrapper
              headerText={<PrideText text={`Delete Conditional Heat`} />}
              bodyText="Are you sure you want to delete this workflow? This action cannot be undone"
              confirmButtonText="Delete"
              handleClose={handleClose}
              handleConfirm={handleConfirm}
              show={show}
            />
          </Col>
        </Row>
      ))}

      <Button onClick={addHeatCondition}>
        <PrideText text="Add Action" />
      </Button>
    </>
  );
}
