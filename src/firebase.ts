import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_h227EYqmnCKjZYMh5oL3yVHWaD59v_g",
  authDomain: "poow-b1bfb.firebaseapp.com",
  projectId: "poow-b1bfb",
  storageBucket: "poow-b1bfb.appspot.com",
  messagingSenderId: "95623468474",
  appId: "1:95623468474:web:c1728578a916f5d22eb983",
  measurementId: "G-SZTCR7QVS6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
