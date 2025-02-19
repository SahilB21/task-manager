// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoyUQ9Sm3uAPjMrWMI16BSEebAb-k1ykE",
  authDomain: "upahead-assignment.firebaseapp.com",
  projectId: "upahead-assignment",
  storageBucket: "upahead-assignment.firebasestorage.app",
  messagingSenderId: "174899066255",
  appId: "1:174899066255:web:2387e60b310362ba3a87fa",
  measurementId: "G-HKEWVGZ0D5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };