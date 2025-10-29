// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwroK_mxtbQRj-qQaRGcEjuOikBwa0-28",
    authDomain: "health-quest-9944d.firebaseapp.com",
    projectId: "health-quest-9944d",
    storageBucket: "health-quest-9944d.firebasestorage.app",
    messagingSenderId: "947311892313",
    appId: "1:947311892313:web:a0a0ee275630ac96b39e48",
    measurementId: "G-DX7G57WHSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); \