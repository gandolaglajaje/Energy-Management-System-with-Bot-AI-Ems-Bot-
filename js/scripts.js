/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

const rateInput = document.getElementById('ratePerKWhInput');

// Assuming each outlet has a unique ID for the total value and result display
const outletData = [
    { totalValueId: 'totalValue_1', resultDisplayId: 'resultDisplay_1' },
    { totalValueId: 'totalValue_2', resultDisplayId: 'resultDisplay_2' },
    { totalValueId: 'totalValue_3', resultDisplayId: 'resultDisplay_3' },
    { totalValueId: 'totalValue_4', resultDisplayId: 'resultDisplay_4' }
];

// Function to update the multiplied value when the input changes
rateInput.addEventListener('input', function() {
    const ratePerKWh = parseFloat(rateInput.value); // Get the entered rate per kWh as a number
    
    if (!isNaN(ratePerKWh)) {
        let totalCost = 0; // Initialize total cost
        
        outletData.forEach(outlet => {
            const totalValueElement = document.getElementById(outlet.totalValueId);
            const resultDisplay = document.getElementById(outlet.resultDisplayId);

            if (totalValueElement && resultDisplay) {
                const totalValue = parseFloat(totalValueElement.textContent); // Get the total value as a number
                
                if (!isNaN(totalValue)) {
                    const multipliedValue = ratePerKWh * totalValue; // Perform multiplication
                    resultDisplay.textContent = multipliedValue.toFixed(2); // Display the multiplied value with two decimal places
                    
                    totalCost += multipliedValue; // Add to total cost
                } else {
                    resultDisplay.textContent = '0.00'; // Display default value if total value is invalid
                }
            }
        });
        
        // Display total cost
        const totalCostDisplay = document.getElementById('totalCostDisplay');
        if (totalCostDisplay) {
            totalCostDisplay.textContent = totalCost.toFixed(2);
        }
    }
});

function applyTime(relayNumber) {

    var reversedRelayNumber = 5 - relayNumber;
    // Get the corresponding start and end time inputs
    var startTimeInput = document.getElementById("startTime" + relayNumber);
    var endTimeInput = document.getElementById("endTime" + relayNumber);

    // Get the selected start and end times as Date objects
    var startTime = new Date();
    var endTime = new Date();
    var selectedStartTime = startTimeInput.value.split(":");
    var selectedEndTime = endTimeInput.value.split(":");
    
    // Set the hours and minutes of the selected times
    startTime.setHours(selectedStartTime[0], selectedStartTime[1]);
    endTime.setHours(selectedEndTime[0], selectedEndTime[1]);

    // Check if the end time is after the start time
    if (startTime < endTime) {
        // Calculate the delay until the start time
        var startDelay = startTime - Date.now();

        // Calculate the delay until the end time
        var endDelay = endTime - Date.now();

        // Set timeout to turn on the relay when start time is reached
        setTimeout(function() {
            toggleRelay(reversedRelayNumber, true); // Turn on the relay
            showAlert("RELAY OUTLET " + relayNumber + " TURNED ON!", true);
        }, startDelay);

        // Set timeout to turn off the relay when end time is reached
        setTimeout(function() {
            toggleRelay(reversedRelayNumber, false); // Turn off the relay
            showAlert("RELAY OUTLET " + relayNumber + " TURNED OFF!", false);
        }, endDelay);

        // Show success alert for applying timer
        showAlert("Timer applied successfully for RELAY OUTLET " + relayNumber, true);
    } else {
        showAlert("END TIME MUST BE AFTER START TIME!", false);
    }
}

// Function to show alert for a specific duration
function showAlert(message,isSuccess) {
    var alertType = isSuccess ? 'success' : 'danger';
    var alertBox = document.createElement('div');
    alertBox.className = 'alert alert-' + alertType + ' fixed-alert text-center fade show';
    alertBox.textContent = message;

    var closeButton = document.createElement('button');
    closeButton.className = 'close';
    closeButton.setAttribute('data-dismiss', 'alert');
    closeButton.innerHTML = '&times;';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.outline = 'none';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0';
    closeButton.style.right = '10px';
    closeButton.style.margin = '0px';
    closeButton.style.padding = '0.5rem';
    closeButton.addEventListener('click', function() {
        alertBox.classList.remove('show');
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 500); // Delay hiding to match transition duration
    });

    alertBox.appendChild(closeButton);
    document.body.appendChild(alertBox);

    setTimeout(function() {
        alertBox.classList.remove('show');
        setTimeout(function() {
            alertBox.style.display = 'none';
        }, 500); // Delay hiding to match transition duration
    }, 5000); // Hide alert after 5 seconds
}

// Function to toggle relay
function toggleRelay(relayNumber, isChecked) {
    // Send toggle command to Raspberry Pi based on isChecked
    var action = isChecked ? 'on' : 'off';
    var message = relayNumber + '_' + action;
    sendCommand(message);
}

// Function to send command to Raspberry Pi via MQTT
function sendCommand(command) {
    var clientId = "web_" + parseInt(Math.random() * 100, 10);
    var mqttClient = new Paho.MQTT.Client("d6a658dae88e478990a76c75f2d2a635.s1.eu.hivemq.cloud", 8884, clientId);

    mqttClient.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("Connection lost:", responseObject.errorMessage);
        }
    };

    var options = {
        useSSL: true,
        userName: 'emsbot', // Replace with your MQTT username
        password: 'Rioja@12345', // Replace with your MQTT password
        onSuccess: function() {
            console.log("Connected to MQTT broker");
            var message = new Paho.MQTT.Message(command);
            message.destinationName = "raspberrypi/relay";
            mqttClient.send(message);
            mqttClient.disconnect();
        },
        onFailure: function(error) {
            console.error("Failed to connect to MQTT broker:", error.errorMessage);
        }
    };

    mqttClient.connect(options);
}
