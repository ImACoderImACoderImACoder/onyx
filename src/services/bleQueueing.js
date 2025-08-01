import {
  setCurrentWorkflow,
  setCurrentWorkflowStepId,
  setCurrentStepEllapsedTimeInSeconds,
} from "../features/workflowEditor/workflowSlice";
import store from "../store";

import { getCharacteristic } from "./BleCharacteristicCache";
import { fanOffUuid } from "../constants/uuids";
import { convertToUInt8BLE } from "./utils";

const currentIntervals = [];
const currentSetTimeouts = [];
const queue = [];
const priorityQueue = [];

let isQueueProcessing = false;
let currentWorkflowIndex = 0;
let workflowFunctions;

export { currentIntervals, currentSetTimeouts };

export function clearIntervals() {
  while (currentIntervals.length > 0) {
    clearInterval(currentIntervals.pop());
  }
}

export function clearTimeouts() {
  while (currentSetTimeouts.length > 0) {
    clearTimeout(currentSetTimeouts.pop());
  }
}

export function AddToQueue(func) {
  queue.push(func);

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    ProcessQueue();
  }
}

export function cancelCurrentWorkflow(turnFanOff = true) {
  clearIntervals();
  clearTimeouts();
  workflowFunctions = {};
  currentWorkflowIndex = -1;
  store.dispatch(setCurrentWorkflowStepId());
  store.dispatch(setCurrentWorkflow());
  store.dispatch(setCurrentStepEllapsedTimeInSeconds(0));

  if (turnFanOff) {
    const blePayload = async () => {
      const fanOffCharacteristic = getCharacteristic(fanOffUuid);
      const buffer = convertToUInt8BLE(0);
      await fanOffCharacteristic.writeValue(buffer);
    };
    AddToQueue(blePayload);
  }
}

export function AddToPriorityQueue(func) {
  priorityQueue.push(func);

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    ProcessQueue();
  }
}

async function ProcessQueue() {
  isQueueProcessing = true;
  if (queue.length === 0 && priorityQueue.length === 0) {
    isQueueProcessing = false;
    return;
  }

  try {
    let func;
    if (priorityQueue.length > 0) {
      func = priorityQueue.shift();
    } else {
      func = queue.shift();
    }
    await func();
    setTimeout(() => {
      ProcessQueue();
    }, 0);
  } catch (error) {
    console.log(`QUEUE ERROR: ${error.toString()}`);
    if (
      error.toString().includes("Characteristic not found in cache") ||
      error.toString().includes("not known for service")
    ) {
      window.location.reload();
    }
    ProcessQueue();
  }
}

export function AddToWorkflowQueue(func) {
  workflowFunctions = func;
  currentWorkflowIndex = -1;
  ProcessWorkflowQueue();
}

function ProcessWorkflowQueue() {
  let currentFunc;

  const next = (resetIndex) => {
    if (resetIndex) {
      currentWorkflowIndex = -1;
    }
    if (currentWorkflowIndex + 1 >= workflowFunctions.length) {
      store.dispatch(setCurrentWorkflow());
      store.dispatch(setCurrentWorkflowStepId());
      store.dispatch(setCurrentStepEllapsedTimeInSeconds(0));
    }
    currentFunc = workflowFunctions[currentWorkflowIndex + 1];
    if (!currentFunc) return;
    setTimeout(() => {
      AddToQueue(async () => {
        await currentFunc(next);
        currentWorkflowIndex++;
      });
    }, 0);
  };
  next();
}

export function clearQueuesAndTimers() {
  cancelCurrentWorkflow(false);
  queue.length = 0;
  priorityQueue.length = 0;
  isQueueProcessing = false;
}
