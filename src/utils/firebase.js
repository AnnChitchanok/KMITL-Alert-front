// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC1j3Sukdz3h4maG2VzrWEVwACCKIezFjA",

  authDomain: "donate-app-1f58f.firebaseapp.com",

  projectId: "donate-app-1f58f",

  storageBucket: "donate-app-1f58f.appspot.com",

  messagingSenderId: "961872534233",

  appId: "1:961872534233:web:acaf8a6f45a1fd3a0bbcc8",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);