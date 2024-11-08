function sendRequest() {
    fetch('/sys', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-area').value = JSON.stringify(data, null, 2);
    }).catch(error => {
        document.getElementById('response-area').value = "Error: " + error;
    });
}

function stopSystem() {
    fetch('/shutdown', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Shutdown initiated.');
    }).catch(error => {
        alert('Failed to initiate shutdown: ' + error);
    });
}
