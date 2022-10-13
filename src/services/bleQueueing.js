import {
  setCurrentWorkflow,
  setCurrentWorkflowStepId,
  setCurrentStepEllapsedTimeInSeconds,
} from "../features/workflowEditor/workflowSlice";
import store from "../store";

const queue = [];
const priorityQueue = [];

let isQueueProcessing = false;

export function AddToQueue(func) {
  queue.push(func);

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    ProcessQueue();
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
    ProcessQueue();
  }
}

let currentWorkflowIndex = 0;
let workflowFunctions;

export function AddToWorkflowQueue(func) {
  workflowFunctions = func;
  currentWorkflowIndex = -1;
  ProcessWorkflowQueue();
}

function ProcessWorkflowQueue() {
  let currentFunc;

  const next = () => {
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

export function ClearWorkflowQueue() {
  workflowFunctions = {};
  currentWorkflowIndex = -1;
}
