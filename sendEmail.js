document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateMessage();
});

function updateMessage() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;

    // Select all elements with class '.totalValue'
var totalValues = document.querySelectorAll('.totalValue');

// Initialize sum variable
var sum = 0;

// Loop through each element and sum up the parsed float value of its text content
totalValues.forEach(function(element) {
    sum += parseFloat(element.textContent.trim());
});

// Calculate average energy consumption
var average = sum / totalValues.length;

// Calculate projected total energy consumption in 30 days
var projectedTotalValueIn30Days = average * 30;

// Assuming KWHtoPeso conversion factor is 11.864 (as per your code)
var KWHtoPeso = average * 11.864;

// Calculate projected average total bill in 30 days based on peso conversion
var projectedTotalValueIn30DaysAverage = projectedTotalValueIn30Days * 11.864;

// Constructing the message string with fixed decimal places for clarity
var message = `Total Energy of Outlet 1: ${parseFloat(document.getElementById('totalValue_1').textContent.trim()).toFixed(2)} kWh;
Total Energy of Outlet 2: ${parseFloat(document.getElementById('totalValue_2').textContent.trim()).toFixed(2)} kWh;
Total Energy of Outlet 3: ${parseFloat(document.getElementById('totalValue_3').textContent.trim()).toFixed(2)} kWh;
Total Energy of Outlet 4: ${parseFloat(document.getElementById('totalValue_4').textContent.trim()).toFixed(2)} kWh;
Average Total Energy of all Outlets: ${average.toFixed(2)} KWH;
Your Average Bill Based on the Total Value: ${KWHtoPeso.toFixed(2)} Pesos;
Projected Average Total Value in 30 Days: ${projectedTotalValueIn30Days.toFixed(2)} KWH;
Your Bill Based on the Projected Total Value: ${projectedTotalValueIn30DaysAverage.toFixed(2)} Pesos;`;



    // Send data to the backend
    fetch('https://emsbot.me/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON only if response is OK
    })
    .then(data => {
        if (data.success) {
            alert('Email sent successfully!');
        } else {
            alert(`Failed to send email: ${data.message || 'Unknown error'}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send email. Please try again.');
    });

    console.log('Sending data:', { name, email, message });
}
