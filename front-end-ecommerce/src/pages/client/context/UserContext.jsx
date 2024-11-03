// UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../../../config/firebaseConfig'; // Ajusta la ruta de importación según tu estructura
import { doc, getDoc } from "firebase/firestore";

// Crear el contexto
const UserContext = createContext();

// Crear un proveedor para el contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para el usuario autenticado
    const [userData, setUserData] = useState(null); // Estado para los datos del usuario en Firestore
    const [loading, setLoading] = useState(true); // Estado para indicar si los datos se están cargando

    useEffect(() => {
        // Escuchar el estado de autenticación
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                // Si el usuario está autenticado, cargar sus datos de Firestore
                const userRef = doc(db, "usuarios", currentUser.uid);
                const userSnap = await getDoc(userRef);
                setUser(currentUser);
                setUserData(userSnap.exists() ? userSnap.data() : null);
            } else {
                // Si no hay usuario autenticado, limpiar el estado
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        // Limpiar el listener cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    // Retornar el contexto con los datos y métodos necesarios
    return (
        <UserContext.Provider value={{ user, userData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto de usuario fácilmente
export const useUser = () => useContext(UserContext);
