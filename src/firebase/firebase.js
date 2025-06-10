"use strict";
// Importaciones de Firebase: inicialización de app, y servicios de Firestore y Auth
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";
import { getAuth }       from "firebase/auth";

// Configuración de tu aplicación web de Firebase, usando variables de entorno
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,         // Clave pública de API
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,      // Dominio de autenticación
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,       // ID del proyecto
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,   // Bucket de almacenamiento
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,        // ID remitente de mensajes
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,           // ID de la app
};

// Inicializa la app de Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// Inicializa el servicio de autenticación de Firebase y lo exporta
export const auth = getAuth(app);

// Inicializa Firestore (base de datos) y lo exporta
export const db   = getFirestore(app);
