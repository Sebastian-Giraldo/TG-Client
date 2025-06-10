// src/index.jsx
"use strict";  // Activa el modo estricto de JavaScript para ayudar a detectar errores en tiempo de desarrollo

import React from "react";                              // Importa React para usar JSX
import { createRoot } from "react-dom/client";         // API moderna para renderizar la aplicación en el DOM

// Importa estilos globales y librerías de UI
import 'bootstrap/dist/css/bootstrap.min.css';           // Estilos de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';       // Iconos de Bootstrap Icons
import './styles.css';                                   // Estilos personalizados de la aplicación

// Importa el componente principal de la aplicación React
import App from "./App.js";

// Selecciona el elemento del DOM con id "root" para renderizar la app
const container = document.getElementById("root");
// Crea el root de React donde se montará el componente <App />
const root = createRoot(container);

// Renderiza la aplicación React dentro del root
root.render(
  // Puedes pasar props al componente App si las necesita
  <App title={"Hola mundo"} subtitle={"test"} />
);
