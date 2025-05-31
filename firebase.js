import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDJLT9DROow0Y09GxU04SKJjCDRNwoPgGM",
  authDomain: "aibizkit.firebaseapp.com",
  projectId: "aibizkit",
  storageBucket: "aibizkit.appspot.com",
  messagingSenderId: "489117182246",
  appId: "1:489117182246:web:97c7754d985e75d798b9e7",
  measurementId: "G-W2JZ9F8Z7R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp };
