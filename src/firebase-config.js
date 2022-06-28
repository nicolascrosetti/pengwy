import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFZBRDGa4Fsc4FRHDaZMz9zEcmUN6wyBo",
  authDomain: "pengwy-c83f9.firebaseapp.com",
  projectId: "pengwy-c83f9",
  storageBucket: "pengwy-c83f9.appspot.com",
  messagingSenderId: "1081072768206",
  appId: "1:1081072768206:web:47f47cea5dd8fa185dac9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();