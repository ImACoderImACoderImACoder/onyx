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

function ProcessQueue() {
  isQueueProcessing = true;
  if (queue.length === 0) {
    console.log("queue cleared!");
    isQueueProcessing = false;
    return;
  }
  const func = queue.shift();
  Promise.resolve()
    .then(() => func)
    .then((r) =>
      setTimeout(() => {
        console.log(`Result of queue promise: ${r}`);
        ProcessQueue();
      }, 0)
    );
}
