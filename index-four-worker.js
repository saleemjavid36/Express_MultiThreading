const express = require('express')

const { Worker } = require("worker_threads");

const app = express()
const PORT = 8001
const THREAD_COUNT = 4

app.get("/non-blocking", (req, res) => {
    res.status(200).send("This page is non-Blocking")
})

function createWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./four-workers.js", {
            workerData: { thread_count: THREAD_COUNT }
        });

        worker.on("message", (data) => resolve(data)); // Resolve when worker sends a message
        worker.on("error", (error) => reject(`Worker error: ${error}`)); // Reject on worker error
        worker.on("exit", (code) => {
            if (code !== 0) {
                reject(`Worker exited with code ${code}`);
            }
        });
    })
}
app.get("/blocking", async (req, res) => {
    try {
        const workerPromises = [];
        for (let i = 0; i < THREAD_COUNT; i++) {
            workerPromises.push(createWorker());
        }
        const thread_results = await Promise.all(workerPromises);
        const total = thread_results[0] 
        + thread_results[1] 
        + thread_results[2] 
        + thread_results[3] 
        res.status(200).send(`result is ${total}`)
    } catch (error) {
        res.status(500).send(`An error occurred: ${error}`);
    }
    
    //    system have 4 threads so upto 3
   
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});