// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5Van2xZMNRZg7eEcVmI7kMsDfQfzjxcA",
  authDomain: "aithink-global.firebaseapp.com",
  projectId: "aithink-global",
  storageBucket: "aithink-global.firebasestorage.app",
  messagingSenderId: "667261184252",
  appId: "1:667261184252:web:14c3cc222f9a5f06508f79",
  measurementId: "G-NEBJ7NQDC0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
