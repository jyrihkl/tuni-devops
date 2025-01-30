const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());

const PORT = 8197;

// PUT /state
app.put("/state", (req, res) => {
    res.sendStatus(404);
});

// GET /state
app.get("/state", (req, res) => {
    res.sendStatus(404);
});

// GET /run-log
app.get("/run-log", (req, res) => {
    res.sendStatus(404);
});

// GET /request
app.get("/request", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => console.log(`State Manager running on port ${PORT}`));