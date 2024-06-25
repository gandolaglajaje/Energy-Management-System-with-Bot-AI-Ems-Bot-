document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateMessage();
});

function updateMessage() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;

    var totalValues = document.querySelectorAll('.totalValue');
    var sum = 0;
    totalValues.forEach(function(element) {
        sum += parseFloat(element.textContent.trim());
    });
    var average = sum / totalValues.length;
    var projectedTotalValueIn30Days = sum * 30;
    var KWHtoPeso = sum * 11.91;
    var projectedTotalValueIn30DaysAverage = projectedTotalValueIn30Days * 11.91;

    var message = `Total Value Outlet 1: ${parseFloat(document.getElementById('totalValue_1').textContent.trim()).toFixed(2)}
Total Value Outlet 2: ${parseFloat(document.getElementById('totalValue_2').textContent.trim()).toFixed(2)}
Total Value Outlet 3: ${parseFloat(document.getElementById('totalValue_3').textContent.trim()).toFixed(2)}
Total Value Outlet 4: ${parseFloat(document.getElementById('totalValue_4').textContent.trim()).toFixed(2)}
Total Value of all Outlets: ${average.toFixed(2)} KWH
Your Bill Based on the Total Value: ${KWHtoPeso.toFixed(2)} Pesos
Projected Total Value in 30 Days: ${projectedTotalValueIn30Days.toFixed(2)} KWH
Your Bill Based on the Projected Total Value: ${projectedTotalValueIn30DaysAverage.toFixed(2)} Pesos`;

    // Send data to the backend
    fetch('http://emsbot.me/api/submit-form', {
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
