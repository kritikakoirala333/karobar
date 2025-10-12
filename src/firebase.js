
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyWGL7HnyuOzc5YmZP-COZAXcKhDkylmc",
  authDomain: "karobar-126b2.firebaseapp.com",
  projectId: "karobar-126b2",
  storageBucket: "karobar-126b2.firebasestorage.app",
  messagingSenderId: "742751519792",
  appId: "1:742751519792:web:586620fc8fa99627c359f5",
  measurementId: "G-W2RVWG9ZL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}