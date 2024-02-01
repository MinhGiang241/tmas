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
  apiKey: "AIzaSyDmkaE51CRnu4AJPo6uAc9Web19sZ-CeHU",
  authDomain: "tmas-5f48e.firebaseapp.com",
  projectId: "tmas-5f48e",
  storageBucket: "tmas-5f48e.appspot.com",
  messagingSenderId: "256219032535",
  appId: "1:256219032535:web:982400f879da9b43cd3992",
  measurementId: "G-MXJB7G7KYT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider };
