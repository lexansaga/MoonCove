// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZvzuSUXxBIOHL0zZqo9Riccw_ngCQeO8",
  authDomain: "mooncove-f41e0.firebaseapp.com",
  databaseURL:
    "https://mooncove-f41e0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mooncove-f41e0",
  storageBucket: "mooncove-f41e0.firebasestorage.app",
  messagingSenderId: "196782660196",
  appId: "1:196782660196:web:e1833cb2d2fc9b7d205d71",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Auth with persistence
const authentication = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { authentication, database };
