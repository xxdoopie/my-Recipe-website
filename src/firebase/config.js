// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEc3IGJwA1Wh1os8WYyQZiSSw7HPjON8M",
  authDomain: "recipeapp-d5f8b.firebaseapp.com",
  projectId: "recipeapp-d5f8b",
  storageBucket: "recipeapp-d5f8b.firebasestorage.app",
  messagingSenderId: "844888078844",
  appId: "1:844888078844:web:e5bbd31f1f18d34f211a79",
  measurementId: "G-CRFETM8GX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;