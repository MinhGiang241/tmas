// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, //"AIzaSyDmkaE51CRnu4AJPo6uAc9Web19sZ-CeHU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // "tmas-5f48e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, //"tmas-5f48e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, //"tmas-5f48e.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, //"256219032535",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, //"1:256219032535:web:982400f879da9b43cd3992",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, //"G-MXJB7G7KYT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider };
