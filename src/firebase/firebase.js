"use strict";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSQhfgkfLJSd5bJ465H4cSvedPfy0HulQ",
  authDomain: "tg-server-app.firebaseapp.com",
  projectId: "tg-server-app",
  storageBucket: "tg-server-app.firebasestorage.app",
  messagingSenderId: "923660607581",
  appId: "1:923660607581:web:bdd74b3250fe5736682db4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

export { auth };
