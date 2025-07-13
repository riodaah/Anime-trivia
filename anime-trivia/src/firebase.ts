// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx9AydKPawmIYwMAkTOUlZfIFkjgHFuk",
  authDomain: "anime-trivia-a7bb7.firebaseapp.com",
  projectId: "anime-trivia-a7bb7",
  storageBucket: "anime-trivia-a7bb7.appspot.com",
  messagingSenderId: "163454466452",
  appId: "1:163454466452:web:47be80f077a426cc33a8a1",
  measurementId: "G-T3DCCHSLNF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
