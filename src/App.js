// src/App.jsx
"use strict";  // Activa el modo estricto de JavaScript para detectar errores comunes

// Importa el componente principal de rutas de la aplicación
import RouterApp from "./routes/Router.jsx";

/**
 * Componente App:
 * - Punto de entrada de la aplicación React.
 * - Renderiza el componente RouterApp que maneja toda la navegación.
 */
function App() {
  // Devuelve el árbol de rutas y componentes configurados en RouterApp
  return (
    <RouterApp />
  );
}

// Exporta App como componente por defecto para ser usado en index.js
export default App;
