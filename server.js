// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Email Route
// app.post('/send-email', async (req, res) => {
//     const { name, email, subject, message } = req.body;
//     console.log("Received form data:", req.body);  // Log form data

//     if (!name || !email || !subject || !message) {
//         return res.status(400).json({ error: "All fields are required!" });
//     }

//     // Configure Nodemailer Transporter (Use your email credentials)
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',  // You can use another email service (e.g., Outlook, Yahoo)
//         auth: {
//             user: process.env.SENDGRID_TO_EMAIL,  // Your email from .env file
//             pass: process.env.EMAIL_PASS   // Your app password from .env file
//         }
//     });

//     let mailOptions = {
//       from: `"Website Form" <${process.env.SENDGRID_TO_EMAIL}>`,  // Your email
//       to: process.env.SENDGRID_TO_EMAIL,                         // Your email
//       replyTo: `${name} <${email}>`,                      // Replies go to the user
//       subject: `[Contact Form] ${subject} (From: ${email})`,
//       text: `Message from ${name} (${email}):\n\n${message}`
//   };
  

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ success: "Email sent successfully!" });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ error: "Failed to send email" });
//     }
// });

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// const nodemailer = require('nodemailer');
// require('dotenv').config();

// module.exports = async (req, res) => {
//     if (req.method === 'POST') {
//         const { name, email, subject, message } = req.body;
//         console.log("Received form data:", req.body);

//         if (!name || !email || !subject || !message) {
//             return res.status(400).json({ error: "All fields are required!" });
//         }

//         let transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.SENDGRID_TO_EMAIL,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         let mailOptions = {
//             from: `"Website Form" <${process.env.SENDGRID_TO_EMAIL}>`,
//             to: process.env.SENDGRID_TO_EMAIL,
//             replyTo: `${name} <${email}>`,
//             subject: `[Contact Form] ${subject} (From: ${email})`,
//             text: `Message from ${name} (${email}):\n\n${message}`
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             res.status(200).json({ success: "Email sent successfully!" });
//         } catch (error) {
//             console.error("Error sending email:", error);
//             res.status(500).json({ error: "Failed to send email" });
//         }
//     } else {
//         res.status(405).json({ error: "Method Not Allowed" });
//     }
// };
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/api/send-email', require('./api/send-email'));

// Handle SPA routing (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
