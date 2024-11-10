// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDZvzuSUXxBIOHL0zZqo9Riccw_ngCQeO8",
//   authDomain: "mooncove-f41e0.firebaseapp.com",
//   databaseURL:
//     "https://mooncove-f41e0-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "mooncove-f41e0",
//   storageBucket: "mooncove-f41e0.firebasestorage.app",
//   messagingSenderId: "196782660196",
//   appId: "1:196782660196:web:e1833cb2d2fc9b7d205d71",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCygC8mecfbFxjOfNATXyfX6_gRtFNmV00",
  authDomain: "justasite-21f6d.firebaseapp.com",
  databaseURL:
    "https://justasite-21f6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "justasite-21f6d",
  storageBucket: "justasite-21f6d.appspot.com",
  messagingSenderId: "659339553761",
  appId: "1:659339553761:web:425ee4af4fddf21784c0a0",
  measurementId: "G-8ZC7Y4BHEG",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Auth with persistence
const authentication = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const storage = getStorage(app);

export { authentication, database, storage };
