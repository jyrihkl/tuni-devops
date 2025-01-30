const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const axios = require('axios');
const PORT = 8197;

app.use(bodyParser.json());

const states = {init: "INIT", paused: "PAUSED", running: "RUNNING", shutdown: "SHUTDOWN"};
let state = states.init;

// Middleware to check credentials against Nginx
async function checkAuth(req, res, next) {
    if (req.method == 'GET') {
        next();
    }

    const authHeader = req.headers['authorization'];

    // console.log('Received request:', req.method, req.url);
    // console.log('Authorization header:', authHeader);

    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // console.log('Forwarding authentication request to Nginx');
        
        // Forward authentication request to Nginx
        const response = await axios.get('http://nginx/', {
            headers: { 'Authorization': authHeader }
        });

        // console.log(response.status);
        // console.log(response.data);

        if (response.status === 200) {
            next(); // Authentication successful, proceed
        } else {
            // console.log(response);
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        // console.error('Error during authentication:', error);
        res.status(401).send('Unauthorized');
    }
}


// PUT /state
app.put("/state", checkAuth, express.text(), (req, res) => {
    const newState = req.body.trim().toUpperCase();

    if (newState === states.init || newState === states.paused || newState === states.running || newState === states.shutdown) {
        state = newState;
        res.status(200).send("State updated");
        return;
    }

    res.status(400).send("Invalid state");
});

// GET /state
app.get("/state", (req, res) => {
    res.status(200)
        .set('Content-Type', 'text/plain')
        .send(state);
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


// Signal handlers to speed up shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    process.exit(0);
});