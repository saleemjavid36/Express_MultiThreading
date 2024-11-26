const express = require('express')

const { Worker } = require("worker_threads");

const app= express()
const PORT = 8001

app.get("/non-blocking",(req,res)=>{
    res.status(200).send("This page is non-Blocking")
})

app.get("/blocking", async (req, res) => {
    const worker = new Worker('./worker.js');
    // Listen for messages from the worker
    worker.on("message", (data) => {
        res.status(200).send(`Result is ${data}`);
    });
    // Handle worker errors
    worker.on("error", (error) => {
        res.status(500).send(`An error occurred: ${error.message}`);
    });

    // Handle worker exit (in case it exits without sending a message)
    worker.on("exit", (code) => {
        if (code !== 0) {
            res.status(500).send(`Worker stopped with exit code ${code}`);
        }
    });
});

app.listen(PORT,()=>console.log(`Server Started at ${PORT}` ))