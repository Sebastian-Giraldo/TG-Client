import React from "react";  // Importa React (necesario si usamos JSX)
import { Navigate, Outlet } from "react-router-dom";  // Outlet para renderizar rutas hijas, Navigate para redireccionar
import { useUser } from "../context/UserContext";  // Hook de contexto para obtener info de usuario

/**
 * Componente ProtectedRoute:
 * - Verifica si hay un usuario autenticado.
 * - Si existe, renderiza las rutas hijas (<Outlet />).
 * - Si NO existe, redirecciona a la ruta de inicio de sesión ('/').
 */
export default function ProtectedRoute() {
  // Obtenemos el objeto `user` del contexto global de usuario
  const { user } = useUser();

  // Si `user` existe (true), permitimos el acceso a las rutas hijas de esta ruta
  // En caso contrario, navegamos a '/' (home o login), reemplazando el historial
  return user
    ? <Outlet />                // Rutas hijas: componentes protegidos que renderizan aquí
    : <Navigate to="/" replace />;  // Redirección a la pantalla pública
}
