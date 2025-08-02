import { useState, useEffect } from "react";
import PrideText from "../../themes/PrideText";
import Button from "../shared/styledComponents/Button";
import StyledControl from "../shared/styledComponents/FormControl";
import { StyledLabel } from "./WorkflowItemEditor";
import { Col, Form, Row } from "react-bootstrap";
import ModalWrapper from "../shared/styledComponents/Modal";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../shared/OutletRenderer/icons/DeleteIcon";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  WriteNewConfigToLocalStorage,
  convertToCelsiusFromFahrenheit,
  convertToFahrenheitFromCelsius,
} from "../../services/utils";
import cloneDeep from "lodash/cloneDeep";
import { setCurrentWorkflows } from "../settings/settingsSlice";
import {
  MIN_CELSIUS_TEMP,
  MAX_CELSIUS_TEMP,
} from "../../constants/temperature";

const DeleteIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DeleteCol = styled(Col)`
  flex: 0 0 40px;
  max-width: 40px;
  padding-left: 8px;
  padding-right: 8px;
`;

const WideStyledControl = styled(StyledControl)`
  min-width: 70px;
  width: 100%;
  font-size: 0.9rem;
`;

export default function ConditionalHeatItemEditor({ workflowId, item }) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({ default: {}, conditions: {} });
  const [show, setShow] = useState(false);
  const [deleteConditionId, setDeleteConditionId] = useState(null);
  const [displayValues, setDisplayValues] = useState({
    default: {},
    conditions: {},
  });

  const config = useSelector((state) => state.settings.config);
  const isF = useSelector((state) => state.settings.isF);
  const dispatch = useDispatch();

  // Get current data from the item's payload
  let data = item.payload || {
    default: {
      temp: MIN_CELSIUS_TEMP,
      wait: 5,
    },
    conditions: [
      { id: Date.now(), ifTemp: MIN_CELSIUS_TEMP, nextTemp: 180, wait: 5 },
    ],
  };

  // Ensure conditions exists and is an array
  if (!data.conditions || !Array.isArray(data.conditions)) {
    data = {
      ...data,
      conditions: [
        { id: Date.now(), ifTemp: MIN_CELSIUS_TEMP, nextTemp: 180, wait: 5 },
      ],
    };
  }

  // Ensure all conditions have unique IDs
  let idCounter = Date.now();
  data.conditions.forEach((condition, index) => {
    if (!condition.id) {
      condition.id = idCounter + index;
    }
  });

  useEffect(() => {
    // Update display values when isF changes
    const newDisplayValues = {
      default: {
        temp: isF
          ? convertToFahrenheitFromCelsius(data.default.temp)
          : data.default.temp,
        wait: data.default.wait,
      },
      conditions: data.conditions.reduce((acc, condition, index) => {
        acc[index] = {
          ifTemp: isF
            ? convertToFahrenheitFromCelsius(condition.ifTemp)
            : condition.ifTemp,
          nextTemp: isF
            ? convertToFahrenheitFromCelsius(condition.nextTemp)
            : condition.nextTemp,
          wait: condition.wait,
        };
        return acc;
      }, {}),
    };
    setDisplayValues(newDisplayValues);

    // Clear all errors when unit changes since values get reset
    setErrors({ default: {}, conditions: {} });
  }, [isF, data]);

  const handleClose = () => {
    setShow(false);
    setDeleteConditionId(null);
  };

  const handleShow = (conditionId) => (e) => {
    e.preventDefault();
    setDeleteConditionId(conditionId);
    setShow(true);
  };

  const handleConfirm = () => {
    if (deleteConditionId !== null) {
      deleteCondition(deleteConditionId);
    }
    handleClose();
  };

  const updateItemPayload = (newData) => {
    const newConfig = cloneDeep(config);
    const workflow = newConfig.workflows.items.find((r) => r.id === workflowId);
    const itemIndex = workflow.payload.findIndex((r) => r.id === item.id);
    workflow.payload[itemIndex].payload = newData;

    WriteNewConfigToLocalStorage(newConfig);
    dispatch(setCurrentWorkflows(newConfig.workflows.items));
  };

  const handleDefaultChange = (field) => (e) => {
    const inputValue = e.target.value.trim();

    // Allow empty wait values
    if (field === "wait" && inputValue === "") {
      setErrors((prev) => ({
        ...prev,
        default: { ...prev.default, [field]: null },
      }));

      const newData = {
        ...data,
        default: {
          ...data.default,
          wait: undefined,
        },
      };
      updateItemPayload(newData);
      return;
    }

    let value =
      field === "wait" ? parseFloat(inputValue) : parseInt(inputValue, 10);

    if (isNaN(value)) {
      setErrors((prev) => ({
        ...prev,
        default: {
          ...prev.default,
          [field]: t('workflowEditor.validation.mustBeValidNumber'),
        },
      }));
      return;
    }

    // Convert to Celsius for validation and storage if needed
    let celsiusValue = value;
    if (field === "temp" && isF) {
      celsiusValue = convertToCelsiusFromFahrenheit(value);
    }

    // Validate in Celsius
    const minValue = field === "temp" ? MIN_CELSIUS_TEMP : 0;
    const maxValue = field === "temp" ? MAX_CELSIUS_TEMP : Infinity;

    if (
      field === "temp" &&
      (celsiusValue < minValue || celsiusValue > maxValue)
    ) {
      const displayMin = isF ? Math.round(minValue * 1.8 + 32) : minValue;
      const displayMax = isF ? Math.round(maxValue * 1.8 + 32) : maxValue;
      const unit = isF ? "°F" : "°C";
      setErrors((prev) => ({
        ...prev,
        default: {
          ...prev.default,
          [field]: t('workflowEditor.validation.temperatureRange', { min: displayMin, max: displayMax, unit }),
        },
      }));
      return;
    } else if (field === "wait" && value < 0) {
      setErrors((prev) => ({
        ...prev,
        default: {
          ...prev.default,
          [field]: t('workflowEditor.validation.mustBeGreaterOrEqualZero'),
        },
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      default: { ...prev.default, [field]: null },
    }));

    const newData = {
      ...data,
      default: {
        ...data.default,
        [field]: field === "temp" ? celsiusValue : value,
      },
    };
    updateItemPayload(newData);
  };

  const handleConditionChange = (index, field) => (e) => {
    const inputValue = e.target.value.trim();

    // Allow empty wait values
    if (field === "wait" && inputValue === "") {
      setErrors((prev) => {
        const newErrors = { ...prev.conditions };
        if (newErrors[index]) {
          newErrors[index][field] = null;
        }
        return { ...prev, conditions: newErrors };
      });

      const newConditions = [...data.conditions];
      newConditions[index] = {
        ...newConditions[index],
        wait: undefined,
      };
      const newData = { ...data, conditions: newConditions };
      updateItemPayload(newData);
      return;
    }

    let value =
      field === "wait" ? parseFloat(inputValue) : parseInt(inputValue, 10);

    if (isNaN(value)) {
      setErrors((prev) => {
        const newErrors = { ...prev.conditions };
        newErrors[index] = {
          ...(newErrors[index] || {}),
          [field]: t('workflowEditor.validation.mustBeValidNumber'),
        };
        return { ...prev, conditions: newErrors };
      });
      return;
    }

    // Convert to Celsius for validation and storage if needed
    let celsiusValue = value;
    if ((field === "ifTemp" || field === "nextTemp") && isF) {
      celsiusValue = convertToCelsiusFromFahrenheit(value);
    }

    // Validate in Celsius
    const minValue =
      field === "ifTemp" || field === "nextTemp" ? MIN_CELSIUS_TEMP : 0;
    const maxValue =
      field === "ifTemp" || field === "nextTemp" ? MAX_CELSIUS_TEMP : Infinity;

    if (
      (field === "ifTemp" || field === "nextTemp") &&
      (celsiusValue < minValue || celsiusValue > maxValue)
    ) {
      const displayMin = isF ? Math.round(minValue * 1.8 + 32) : minValue;
      const displayMax = isF ? Math.round(maxValue * 1.8 + 32) : maxValue;
      const unit = isF ? "°F" : "°C";
      setErrors((prev) => {
        const newErrors = { ...prev.conditions };
        newErrors[index] = {
          ...(newErrors[index] || {}),
          [field]: t('workflowEditor.validation.temperatureRange', { min: displayMin, max: displayMax, unit }),
        };
        return { ...prev, conditions: newErrors };
      });
      return;
    } else if (field === "wait" && value < 0) {
      setErrors((prev) => {
        const newErrors = { ...prev.conditions };
        newErrors[index] = {
          ...(newErrors[index] || {}),
          [field]: t('workflowEditor.validation.mustBeGreaterOrEqualZero'),
        };
        return { ...prev, conditions: newErrors };
      });
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev.conditions };
      if (newErrors[index]) {
        newErrors[index][field] = null;
      }
      return { ...prev, conditions: newErrors };
    });

    const newConditions = [...data.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]:
        field === "ifTemp" || field === "nextTemp" ? celsiusValue : value,
    };
    const newData = { ...data, conditions: newConditions };
    updateItemPayload(newData);
  };

  const addCondition = () => {
    const lastCondition = data.conditions[data.conditions.length - 1];

    // Generate unique ID by finding max existing ID and adding 1
    const maxId = Math.max(...data.conditions.map((c) => c.id || 0));
    const newCondition = {
      id: maxId + 1,
      ifTemp: lastCondition ? lastCondition.nextTemp : MIN_CELSIUS_TEMP,
      nextTemp: lastCondition
        ? lastCondition.nextTemp + 5
        : MIN_CELSIUS_TEMP + 5,
      wait: undefined,
    };

    const newData = {
      ...data,
      conditions: [...data.conditions, newCondition],
    };
    updateItemPayload(newData);
  };

  const deleteCondition = (conditionId) => {
    if (!data.conditions || data.conditions.length <= 1) {
      return; // Don't delete the last condition
    }

    // Find condition to delete
    const conditionToDelete = data.conditions.find((c) => c.id === conditionId);
    if (!conditionToDelete) {
      console.warn("Condition not found for deletion:", conditionId);
      return;
    }

    const newConditions = data.conditions.filter(
      (condition) => condition.id !== conditionId
    );

    // Ensure we still have at least one condition
    if (newConditions.length === 0) {
      console.warn("Cannot delete last condition");
      return;
    }

    const newData = { ...data, conditions: newConditions };
    updateItemPayload(newData);
  };

  const handler = (conditionId) => (e) => {
    if (e.keyCode === 13) {
      handleShow(conditionId)(e);
    }
  };

  return (
    <>
      <h4>{t('workflowEditor.conditionalHeat.defaultSettings')}</h4>
      <Row className="mb-3">
        <Col>
          <StyledLabel>{t('workflowEditor.conditionalHeat.defaultTemp')}</StyledLabel>
          <StyledControl
            type="number"
            inputMode="decimal"
            value={displayValues.default.temp}
            onChange={(e) =>
              setDisplayValues((prev) => ({
                ...prev,
                default: { ...prev.default, temp: e.target.value },
              }))
            }
            onBlur={handleDefaultChange("temp")}
            isValid={!errors.default.temp}
            isInvalid={!!errors.default.temp}
          />
          <StyledControl.Feedback type="invalid">
            {errors.default.temp}
          </StyledControl.Feedback>
        </Col>
        <Col>
          <StyledLabel>{t('workflowEditor.conditionalHeat.defaultWait')}</StyledLabel>
          <StyledControl
            type="number"
            inputMode="decimal"
            step="1"
            placeholder={t('workflowEditor.conditionalHeat.optional')}
            value={
              displayValues.default.wait !== undefined
                ? displayValues.default.wait
                : ""
            }
            onChange={(e) =>
              setDisplayValues((prev) => ({
                ...prev,
                default: { ...prev.default, wait: e.target.value },
              }))
            }
            onBlur={handleDefaultChange("wait")}
            isValid={!errors.default.wait}
            isInvalid={!!errors.default.wait}
          />
          <StyledControl.Feedback type="invalid">
            {errors.default.wait}
          </StyledControl.Feedback>
        </Col>
      </Row>

      <hr className="my-4" />

      <h4>{t('workflowEditor.conditionalHeat.heatConditions')}</h4>
      {data.conditions.map((cond, idx) => (
        <div className="d-flex gap-2 mb-3" key={cond.id || idx}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <StyledLabel>{t('workflowEditor.conditionalHeat.ifTemp')}</StyledLabel>
            <WideStyledControl
              type="number"
              inputMode="decimal"
              value={displayValues.conditions[idx]?.ifTemp}
              onChange={(e) =>
                setDisplayValues((prev) => ({
                  ...prev,
                  conditions: {
                    ...prev.conditions,
                    [idx]: { ...prev.conditions[idx], ifTemp: e.target.value },
                  },
                }))
              }
              onBlur={handleConditionChange(idx, "ifTemp")}
              isValid={!errors.conditions[idx]?.ifTemp}
              isInvalid={!!errors.conditions[idx]?.ifTemp}
            />
            <WideStyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.ifTemp}
            </WideStyledControl.Feedback>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <StyledLabel>{t('workflowEditor.conditionalHeat.thenSet')}</StyledLabel>
            <WideStyledControl
              type="number"
              inputMode="decimal"
              value={displayValues.conditions[idx]?.nextTemp}
              onChange={(e) =>
                setDisplayValues((prev) => ({
                  ...prev,
                  conditions: {
                    ...prev.conditions,
                    [idx]: {
                      ...prev.conditions[idx],
                      nextTemp: e.target.value,
                    },
                  },
                }))
              }
              onBlur={handleConditionChange(idx, "nextTemp")}
              isValid={!errors.conditions[idx]?.nextTemp}
              isInvalid={!!errors.conditions[idx]?.nextTemp}
            />
            <WideStyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.nextTemp}
            </WideStyledControl.Feedback>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <StyledLabel>{t('workflowEditor.conditionalHeat.wait')}</StyledLabel>
            <WideStyledControl
              type="number"
              inputMode="decimal"
              step="1"
              placeholder={t('workflowEditor.conditionalHeat.optionalShort')}
              value={
                displayValues.conditions[idx]?.wait !== undefined
                  ? displayValues.conditions[idx]?.wait
                  : ""
              }
              onChange={(e) =>
                setDisplayValues((prev) => ({
                  ...prev,
                  conditions: {
                    ...prev.conditions,
                    [idx]: { ...prev.conditions[idx], wait: e.target.value },
                  },
                }))
              }
              onBlur={handleConditionChange(idx, "wait")}
              isValid={!errors.conditions[idx]?.wait}
              isInvalid={!!errors.conditions[idx]?.wait}
            />
            <WideStyledControl.Feedback type="invalid">
              {errors.conditions[idx]?.wait}
            </WideStyledControl.Feedback>
          </div>
          <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '0.375rem', flexShrink: 0, width: '32px', justifyContent: 'center' }}>
            <DeleteIconWrapper
              onClick={handleShow(cond.id)}
              onKeyDown={handler(cond.id)}
              tabIndex={0}
              role="button"
              aria-label={t('workflowEditor.conditionalHeat.deleteCondition', { index: idx + 1 })}
            >
              <DeleteIcon />
            </DeleteIconWrapper>
          </div>
        </div>
      ))}

      <Button onClick={addCondition}>
        <PrideText text={t('workflowEditor.conditionalHeat.addCondition')} />
      </Button>

      <ModalWrapper
        headerText={<PrideText text={t('workflowEditor.conditionalHeat.deleteConditionTitle')} />}
        bodyText={t('workflowEditor.conditionalHeat.deleteConditionConfirm')}
        confirmButtonText={t('workflowEditor.conditionalHeat.delete')}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        show={show}
      />
    </>
  );
}
