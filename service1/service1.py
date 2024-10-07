import os
import subprocess
import requests
import json
from flask import Flask, jsonify

app = Flask(__name__)

# Function to get system information
def get_system_info():
    ip_address = os.popen('hostname -I').read().strip()
    processes = os.popen('ps -ax').read()
    disk_space = os.popen('df -hP /').read()
    uptime = os.popen('uptime -p').read().strip()
    
    return {
        'ip_address': ip_address,
        'processes': processes,
        'disk_space': disk_space,
        'uptime': uptime
    }

@app.route('/')
def get_info():
    # Get information from Service1
    service1_info = get_system_info()

    # Request information from Service2
    service2_response = requests.get('http://service2:5001/')
    service2_info = service2_response.json()

    # Combine information from both services
    result = {
        'Service1': service1_info,
        'Service2': service2_info
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8199)

