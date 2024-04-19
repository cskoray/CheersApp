import { initializeApp } from "firebase/app";
import { getFirestore, doc, documentId } from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXf6-AqkPWAM3qpf8oLVijq5tUTB0hLe8",
  authDomain: "cheer-app-7c59c.firebaseapp.com",
  projectId: "cheer-app-7c59c",
  storageBucket: "cheer-app-7c59c.appspot.com",
  messagingSenderId: "732399280629",
  appId: "1:732399280629:web:7aab1722aa3d73759bc0bc",
  measurementId: "G-P2ETGVGDS5",
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const auth = getAuth(app);
const db = getFirestore(app); // initializeFirestore(app, { experimentalForceLongPolling: true });

export { db, auth, doc, documentId };
