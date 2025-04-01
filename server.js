require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email Route
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log("Received form data:", req.body);  // Log form data

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    // Configure Nodemailer Transporter (Use your email credentials)
    let transporter = nodemailer.createTransport({
        service: 'gmail',  // You can use another email service (e.g., Outlook, Yahoo)
        auth: {
            user: process.env.EMAIL_USER,  // Your email from .env file
            pass: process.env.EMAIL_PASS   // Your app password from .env file
        }
    });

    let mailOptions = {
      from: `"Website Form" <${process.env.EMAIL_USER}>`,  // Your email
      to: process.env.EMAIL_USER,                         // Your email
      replyTo: `${name} <${email}>`,                      // Replies go to the user
      subject: `[Contact Form] ${subject} (From: ${email})`,
      text: `Message from ${name} (${email}):\n\n${message}`
  };
  

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
