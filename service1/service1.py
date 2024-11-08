import os
import subprocess
import requests
import json
import time
import signal
import sys
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def handle_shutdown(signum, frame):
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_shutdown)

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

sleeping = False
def intermittent_sleep():
    global sleeping
    sleep_time = 2
    if not sleeping:
        sleeping = True
        print(f"Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)
        print(f"{sleep_time} seconds have passed")
        sleeping = False

@app.after_request
def sleep_after_response(response):

    @response.call_on_close
    def sleep_after_close():
        intermittent_sleep()

    return response

@app.route('/info', methods=['GET'])
def get_info():
    # Get information from Service1
    service1_info = get_system_info()

    # Request information from Service2
    try:
        service2_response = requests.get('http://service2:5001/')
        service2_info = service2_response.json()
    except requests.RequestException as e:
        service2_info = {"error": "Could not reach Service2", "details": str(e)}

    # Combine information from both services
    result = {
        'Service1': service1_info,
        'Service2': service2_info
    }

    print("Returning response from service1")

    return jsonify(result)

@app.route('/shutdown', methods=['POST'])
def shutdown():
    try:
        subprocess.run(["docker", "compose", "down"], check=True)
        return jsonify({"message": "System is shutting down..."})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Failed to shut down: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8199)
