import {
  setCurrentWorkflow,
  setCurrentWorkflowStepId,
} from "../features/workflowEditor/workflowSlice";
import store from "../store";

const queue = [];

let isQueueProcessing = false;

export function AddToQueue(func) {
  queue.push(func);

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    ProcessQueue();
  }
}

async function ProcessQueue() {
  isQueueProcessing = true;
  if (queue.length === 0) {
    isQueueProcessing = false;
    return;
  }

  try {
    const func = queue.shift();
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
    currentWorkflowIndex++;
    if (currentWorkflowIndex + 1 >= workflowFunctions.length) {
      store.dispatch(setCurrentWorkflow());
      store.dispatch(setCurrentWorkflowStepId());
    }
    currentFunc = workflowFunctions[currentWorkflowIndex];
    if (!currentFunc) return;
    setTimeout(() => {
      AddToQueue(async () => {
        await currentFunc(next);
      });
    }, 100);
  };
  next();
}

export function ClearWorkflowQueue() {
  workflowFunctions = {};
  currentWorkflowIndex = -1;
}
