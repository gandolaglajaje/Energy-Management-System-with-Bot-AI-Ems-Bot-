require('dotenv').config();
const express = require('express');
const { EmailClient } = require("@azure/communication-email");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Initialize EmailClient with your Azure connection string
const connectionString = "endpoint=https://emsbotdemo.asiapacific.communication.azure.com/;accesskey=TX9Bw3q0qKbS8+EQXy4eeYEuitjIRRhImvXDXeY+F5ooeBGPmxst8uUxBaP4p23NDSn2ujWJ2b36yuvZq2CL4g==";
const client = new EmailClient(connectionString);

// POST endpoint to handle form submission
app.post('/submit-form', async (req, res) => {  // use relative path
    const { name, email, message } = req.body;

    const emailMessage = {
        senderAddress: "DoNotReply@0866917c-b7db-4d6c-8620-130be55710a8.azurecomm.net",
        content: {
            subject: "Energy Consumption Report",
            plainText: `Hello ${name},\n\n${message}`,
        },
        recipients: {
            to: [{ address: email }],
        },
    };

    try {
        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        console.log(`Email sent successfully: ${result.id}`);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
