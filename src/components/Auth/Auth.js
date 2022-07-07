import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, getDownloadURL, getStorage } from "firebase/storage";
import { Redirect, useLocation } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import CircularProgress from '@mui/material/CircularProgress';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoding] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [positions, setPositions] = useState(null);
    const [dataUsers , setDataUsers] = useState();
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser);
            if (currentUser) {
                onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    localStorage.setItem("uid", currentUser.uid);
                    localStorage.setItem("Username", doc.data().displayName);
                    localStorage.setItem("email", currentUser.email);
                    localStorage.setItem("positions", positions)
                });
            }
            setLoding(false);
        });

        navigator.geolocation.getCurrentPosition(function (position) {
            setPositions(position);
        });

    }, [currentUser]);

    if (loading) {
        return <CircularProgress className='progress' />;
    }

    return (
        <AuthContext.Provider value={{ currentUser, positions , dataUsers}}>
            {children}
        </AuthContext.Provider>
    );
};
