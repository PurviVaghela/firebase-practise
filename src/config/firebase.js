import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqkI9_gBIco5f0ZVMLhTkklXFCpRvuf8Q",
  authDomain: "fir-126c8.firebaseapp.com",
  projectId: "fir-126c8",
  storageBucket: "fir-126c8.appspot.com",
  messagingSenderId: "984992170635",
  appId: "1:984992170635:web:7fb7fc313c43e3866d8a8e",
  measurementId: "G-FNER4G4KD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);   
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
