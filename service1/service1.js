const express = require('express');
const axios = require('axios');
const os = require('os');
const { exec } = require('child_process');

const app = express();
const PORT = 8199;

// Cooldown period control
let isCoolingDown = false;

// Helper function to execute shell commands and return output
const execCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Function to get system information
async function getSystemInfo() {
    const ipAddress = (await execCommand('hostname -I')).trim();
    const processes = await execCommand('ps -ax');
    const diskSpace = await execCommand('df -hP /');
    const uptime = (await execCommand('uptime -p')).trim();

    return {
        ip_address: ipAddress,
        processes: processes,
        disk_space: diskSpace,
        uptime: uptime
    };
}

app.get('/info/', async (req, res) => {
    if (isCoolingDown) {
        res.status(503).json({ error: 'Service is temporarily unavailable due to cooldown period' });
        return;
    }

    // Set cooldown to true to block further requests
    isCoolingDown = true;

    try {
        const service1Info = await getSystemInfo();

        // Request information from Service2
        let service2Info = {};
        try {
            const response = await axios.get('http://service2:5001/');
            service2Info = response.data;
        } catch (error) {
            service2Info = { error: 'Failed to connect to Service2' };
        }

        // Combine and send response
        res.json({
            Service1: service1Info,
            Service2: service2Info
        });

        // Cooldown period (2 seconds)
        setTimeout(() => {
            isCoolingDown = false;
        }, 2000);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        isCoolingDown = false; // Reset cooldown in case of error
    }
});

app.listen(PORT, () => {
    console.log(`Service1 is running on port ${PORT}`);
});
