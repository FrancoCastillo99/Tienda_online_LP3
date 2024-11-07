import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../../../config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            await signOut(auth);
            // Limpiar estados
            setUser(null);
            setUserData(null);
            // Limpiar cualquier dato sensible del localStorage si lo hubiera
            localStorage.clear();
            // Limpiar cookies si las hay
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userRef = doc(db, "usuarios", currentUser.uid);
                const userSnap = await getDoc(userRef);
                setUser(currentUser);
                setUserData(userSnap.exists() ? userSnap.data() : null);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userData, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);