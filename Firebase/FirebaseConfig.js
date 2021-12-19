import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDnFSJGU3GRVuoo8IUNTagpZ6hWhODVKz4",
  authDomain: "foodpanda-98.firebaseapp.com",
  projectId: "foodpanda-98",
  storageBucket: "foodpanda-98.appspot.com",
  messagingSenderId: "303914841272",
  appId: "1:303914841272:web:689ecd44c2e16fa247b04d",
});

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  storage,
  ref,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
};
