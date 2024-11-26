const { parentPort } = require("worker_threads");

let counter = 0;
for (let i = 0; i < 20_000_000_000; i++) {
    counter++;
}

// Send the result back to the main thread
parentPort.postMessage(counter);