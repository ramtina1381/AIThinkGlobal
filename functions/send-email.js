const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // Netlify will handle this as an environment variable

exports.handler = async function(event, context) {
  const data = JSON.parse(event.body);

  // Validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid email address' }),
    };
  }

  const msg = {
    to: process.env.EMAIL_USER,  // Replace with your recipient's email
    from: data.email,            // Use the email provided in the form
    subject: data.subject,
    text: data.message,
    html: `<p>${data.message}</p>`,
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
