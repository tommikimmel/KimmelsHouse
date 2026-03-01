import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFE3jPWg-rFAXUoAWj6CbE7BYzKZbDqKo",
  authDomain: "kimmelshouse-c774c.firebaseapp.com",
  projectId: "kimmelshouse-c774c",
  storageBucket: "kimmelshouse-c774c.firebasestorage.app",
  messagingSenderId: "88089931742",
  appId: "1:88089931742:web:39125eb8973df2a602b74f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;
