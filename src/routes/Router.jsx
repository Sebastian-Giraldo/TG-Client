// src/routes/RouterApp.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Consultas from "../pages/consultas/Consultas";
import VerificarPerfil from "../pages/validar perfil/VerificarPerfil";
import ProfileHistory from "../pages/perfiles/ProfileHistory";
import Footer from "../components/Footer";

import { UserProvider, useUser } from "../context/UserContext";
import ProtectedRoute from "../components/ProtectedRoute";

// Componente para redirigir en caso de ruta no existente
function CatchAll() {
  const { user } = useUser();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function RouterApp() {
  return (
   
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultas" element={<Consultas />} />
            {/* etc */}
          </Route>

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default RouterApp;
