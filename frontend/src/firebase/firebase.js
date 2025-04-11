// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBCSBd7yI99hXfwgC7bRMeoxwh__5TGEvE",
    authDomain: "insurely-24724.firebaseapp.com",
    projectId: "insurely-24724",
    storageBucket: "insurely-24724.firebasestorage.app",
    messagingSenderId: "442514533551",
    appId: "1:442514533551:web:622ebf014ddcf8ee4f785a"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
