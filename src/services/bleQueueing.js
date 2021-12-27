const queue = [];

let isQueueProcessing = false;

export function AddToQueue(func) {
  queue.push(func);

  if (!isQueueProcessing) {
    isQueueProcessing = true;
    console.log("called process queue");
    ProcessQueue();
  }
}

async function ProcessQueue() {
  isQueueProcessing = true;
  if (queue.length === 0) {
    console.log("queue cleared!");
    isQueueProcessing = false;
    return;
  }

  try {
    const func = queue.shift();
    const r = await func();
    console.log(`The result of the ble payload is: ${r}`);
    setTimeout(() => {
      ProcessQueue();
    }, 0);
  } catch (error) {
    console.log(`QUEUE ERROR: ${error.toString()}`);
    ProcessQueue();
  }
}
