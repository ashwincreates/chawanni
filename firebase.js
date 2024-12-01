// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWwiS_yffxWygsbI150C27vd0TeOeXkxk",
  authDomain: "rokra-48743.firebaseapp.com",
  projectId: "rokra-48743",
  storageBucket: "rokra-48743.firebasestorage.app",
  messagingSenderId: "1032487482769",
  appId: "1:1032487482769:web:c27caca29bc54741881630"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
export const db = getFirestore(app);
