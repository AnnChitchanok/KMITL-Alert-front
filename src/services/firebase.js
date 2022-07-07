
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBABMNxzOkEoG9ojhP7f3-m-pATiDllM-Q",
    authDomain: "react-authenic.firebaseapp.com",
    projectId: "react-authenic",
    storageBucket: "react-authenic.appspot.com",
    messagingSenderId: "959721882035",
    appId: "1:959721882035:web:2a01e91d468e5ebaa28bc6",
    measurementId: "G-ZFKMJBVQJ2",
    databaseURL: "https://react-authenic-default-rtdb.asia-southeast1.firebasedatabase.app"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
