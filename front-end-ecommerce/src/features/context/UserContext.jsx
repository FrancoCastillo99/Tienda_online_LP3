import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Función para persistir datos del usuario
    const persistUserData = (firebaseUser, firestoreData) => {
        if (firebaseUser && firestoreData) {
            const persistedData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                lastUpdated: new Date().getTime(), // Añadimos timestamp
                ...firestoreData
            };
            localStorage.setItem('userData', JSON.stringify(persistedData));
        }
    };

    // Función para cargar datos persistidos
    const loadPersistedData = () => {
        try {
            const persistedData = localStorage.getItem('userData');
            if (persistedData) {
                const parsedData = JSON.parse(persistedData);
                
                // Verificar si los datos son recientes (menos de 1 hora)
                const now = new Date().getTime();
                const dataAge = now - (parsedData.lastUpdated || 0);
                if (dataAge < 3600000) { // 1 hora en milisegundos
                    return parsedData;
                } else {
                    localStorage.removeItem('userData');
                    return null;
                }
            }
        } catch (error) {
            console.error("Error loading persisted data:", error);
            localStorage.removeItem('userData');
        }
        return null;
    };

    // Función para limpiar datos persistidos
    const clearPersistedData = () => {
        localStorage.removeItem('userData');
        // Limpiar cookies si las hay
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // Limpiar estados
            setUser(null);
            setUserData(null);
            // Limpiar datos persistidos
            clearPersistedData();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        // Función para actualizar el estado de forma segura
        const safeSetState = (setter, value) => {
            if (isMounted) setter(value);
        };

        // Cargar datos persistidos inmediatamente
        const persistedData = loadPersistedData();
        if (persistedData) {
            safeSetState(setUserData, persistedData);
            safeSetState(setIsLoading, false); // Reducir el tiempo de carga inicial si hay datos persistidos
        }

        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            try {
                if (currentUser) {
                    // Si los datos persistidos coinciden con el usuario actual y son recientes,
                    // no recargar de Firestore inmediatamente
                    if (persistedData && persistedData.uid === currentUser.uid) {
                        safeSetState(setUser, currentUser);
                        
                        // Cargar datos de Firestore en segundo plano
                        const userRef = doc(db, "usuarios", currentUser.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            const firestoreData = userSnap.data();
                            safeSetState(setUserData, firestoreData);
                            persistUserData(currentUser, firestoreData);
                        }
                    } else {
                        // Si no hay datos persistidos o son obsoletos, cargar de Firestore
                        const userRef = doc(db, "usuarios", currentUser.uid);
                        const userSnap = await getDoc(userRef);
                        const firestoreData = userSnap.exists() ? userSnap.data() : null;

                        safeSetState(setUser, currentUser);
                        safeSetState(setUserData, firestoreData);
                        persistUserData(currentUser, firestoreData);
                    }
                } else {
                    safeSetState(setUser, null);
                    safeSetState(setUserData, null);
                    clearPersistedData();
                }
            } catch (error) {
                console.error("Error al cargar datos del usuario:", error);
                // En caso de error, intentar usar datos persistidos
                const fallbackData = loadPersistedData();
                if (fallbackData) {
                    safeSetState(setUserData, fallbackData);
                }
            } finally {
                safeSetState(setIsLoading, false);
            }
        });

        // Cleanup function
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // Valor del contexto con tipos de usuario calculados
    const contextValue = {
        user,
        userData,
        isLoading,
        isAuthenticated: !!userData,
        isAdmin: userData?.rol === 'admin',
        logout,
        // Método auxiliar para verificar si el usuario tiene cierto rol
        hasRole: (role) => userData?.rol === role,
        // Método para actualizar userData manualmente si es necesario
        updateUserData: (newData) => {
            setUserData(prevData => {
                const updatedData = { ...prevData, ...newData };
                persistUserData(user, updatedData);
                return updatedData;
            });
        }
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};

export default UserContext;