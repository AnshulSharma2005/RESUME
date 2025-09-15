import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyA-ZvLlBu1i-PwrejXyCiwwULsUJqBzvFc",
  authDomain: "resume-8b0ef.firebaseapp.com",
  projectId: "resume-8b0ef",
  storageBucket: "resume-8b0ef.appspot.com",
  messagingSenderId: "925899222408",
  appId: "1:925899222408:web:2df8397879b298081c1e3d",
  measurementId: "G-690XL4VQBN"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");
