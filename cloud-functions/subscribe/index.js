const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

functions.http('subscribe', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing)

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    res.status(400).send('Invalid email');
    return;
  }

  try {
    await db.collection('newsletterSubscribers').add({
      email: email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).send('Email added successfully');
  } catch (error) {
    console.error('Error adding email:', error);
    res.status(500).send('Error adding email');
  }
});