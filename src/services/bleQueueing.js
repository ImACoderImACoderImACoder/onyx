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

async function ProcessWorkflowQueue() {
  let currentFunc;

  const next = () => {
    currentWorkflowIndex++;

    currentFunc = workflowFunctions[currentWorkflowIndex];
    if (!currentFunc) return;
    setTimeout(() => {
      AddToQueue(async () => {
        await currentFunc(next);
      });
    }, 0);
  };
  next();
}
