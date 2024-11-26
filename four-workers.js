const { workerData, parentPort } = require("worker_threads");

let counter = 0;

// Divide the work among threads
for (let i = 0; i < 20_000_000_000 / workerData.thread_count; i++) {
    counter++;
}

// Send the result back to the main thread
parentPort.postMessage(counter);