// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage }from 'firebase/storage'
import { getAuth }from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7-fdEY74R2AT_5y3C5tZHg7nAEAaTpyY",
  authDomain: "podcast-150cb.firebaseapp.com",
  projectId: "podcast-150cb",
  storageBucket: "podcast-150cb.appspot.com",
  messagingSenderId: "1088288818822",
  appId: "1:1088288818822:web:414dc7ccebd9fa8165f307"

  // apiKey: "AIzaSyDfYKM6avtQenI5hJkiGzRbtD3GexDyT4A",
  // authDomain: "podcast-e44cc.firebaseapp.com",
  // projectId: "podcast-e44cc",
  // storageBucket: "podcast-e44cc.appspot.com",
  // messagingSenderId: "999385548588",
  // appId: "1:999385548588:web:2838d462b2d3a0586f8e89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth  = getAuth(app);
export {app, db, storage, auth};

// 2nd

