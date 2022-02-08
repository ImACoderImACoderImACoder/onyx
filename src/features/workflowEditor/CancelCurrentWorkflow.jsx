import Button from "./shared/WorkflowFooterButtons";
import { ClearWorkflowQueue } from "../../services/bleQueueing";
import { setCurrentWorkflow, setCurrentWorkflowStepId } from "./workflowSlice";
import { useDispatch } from "react-redux";
import { AddToQueue } from "../../services/bleQueueing";
import { fanOffUuid } from "../../constants/uuids";
import { getCharacteristic } from "../../services/BleCharacteristicCache";
import { convertToUInt8BLE } from "../../services/utils";

export default function CancelCurrentWorkflow() {
  const dispatch = useDispatch();

  const onClick = () => {
    ClearWorkflowQueue();
    dispatch(setCurrentWorkflowStepId());
    dispatch(setCurrentWorkflow());
    const blePayload = async () => {
      const fanOffCharacteristic = getCharacteristic(fanOffUuid);
      const buffer = convertToUInt8BLE(0);
      await fanOffCharacteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  };

  return <Button onClick={onClick}>Cancel Active Workflow</Button>;
}
