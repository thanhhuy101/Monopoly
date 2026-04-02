// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnQvx5KbLO2heMb05mBVZPFz2tX9_tNYw",
  authDomain: "cobalt-logic-472603-u7.firebaseapp.com",
  databaseURL: "https://cobalt-logic-472603-u7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cobalt-logic-472603-u7",
  storageBucket: "cobalt-logic-472603-u7.firebasestorage.app",
  messagingSenderId: "515861883352",
  appId: "1:515861883352:web:5937630ec6bfd0f1322aad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);

export default app;
