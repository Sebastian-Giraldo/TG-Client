// src/routes/RouterApp.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";                     // Componentes para enrutamiento

// Import de páginas públicas
import Landing        from "../pages/landing/Landing";
import Login          from "../pages/login/Login";
import Register       from "../pages/register/Register";

// Import de páginas y componentes protegidos
import Dashboard      from "../pages/dashboard/Dashboard";
import Consultas      from "../pages/consultas/Consultas";
import VerificarPerfil from "../pages/validar perfil/VerificarPerfil";
import ProfileHistory from "../pages/perfiles/ProfileHistory";
import Resultados     from "../pages/resultados/Resultados";
import Footer         from "../components/Footer";

// Contexto de usuario y ruta protegida
import { UserProvider, useUser } from "../context/UserContext";
import ProtectedRoute             from "../components/ProtectedRoute";

/**
 * Componente CatchAll:
 * - Captura rutas no definidas y redirige según si el usuario está autenticado
 */
function CatchAll() {
  const { user } = useUser();           // Obtiene usuario del contexto
  // Si está logueado → /dashboard, si no → landing (/)
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
}

/**
 * Componente RouterApp:
 * - Envuelve la aplicación en BrowserRouter y UserProvider
 * - Define rutas públicas y protegidas
 * - Añade un footer común
 */
function RouterApp() {
  return (
    <BrowserRouter>
      {/* Proveedor de contexto de usuario */}
      <UserProvider>
        {/* Definición de rutas */}
        <Routes>
          {/* Rutas públicas (accesibles sin login) */}
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas: requieren usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            {/* Al usar Outlet, estas rutas solo renderizan si ProtectedRoute autoriza */}
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/consultas"      element={<Consultas />} />
            <Route path="/profileHistory" element={<ProfileHistory />} />
            <Route path="/verificarPerfil" element={<VerificarPerfil />} />
            <Route path="/resultados"      element={<Resultados />} />
          </Route>

          {/* Ruta comodín para URLs no definidas */}
          <Route path="*" element={<CatchAll />} />
        </Routes>

        {/* Componente Footer que aparece en todas las páginas */}
        <Footer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default RouterApp; // Exporta el componente principal de rutas
