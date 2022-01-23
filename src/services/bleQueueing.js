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
