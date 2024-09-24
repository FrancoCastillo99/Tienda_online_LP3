import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importar Firestore

const firebaseConfig = {
    apiKey: "AIzaSyBDY69LNBC8Y0xpE7y5ERa79t1_T41Qfts",
    authDomain: "buensabor-bf862.firebaseapp.com",
    projectId: "buensabor-bf862",
    storageBucket: "buensabor-bf862.appspot.com",
    messagingSenderId: "860010897840",
    appId: "1:860010897840:web:06ac0055f873a17500f675",
    measurementId: "G-LCN3V63NEG"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios de autenticación, Firestore y el proveedor de Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Exportar la instancia de Firestore
