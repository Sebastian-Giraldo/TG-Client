import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./styleSidebar.css";
import LogoutButton from "./LogoutButton";

/**
 * Componente Sidebar:
 * - Barra lateral que muestra la navegación y datos del usuario.
 * - Se puede abrir/cerrar y recuerda su estado en localStorage.
 */
function Sidebar() {
  // Estado para saber si la barra está abierta o cerrada,
  // inicializado desde localStorage (si existe) o true por defecto
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-open");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Hook para obtener la ruta actual y marcar el título dinámico
  const location = useLocation();
  // Contexto global de usuario para obtener datos del usuario logueado
  const { user } = useUser();

  // Ref para controlar el temporizador de auto-cierre
  const autoCloseRef = useRef(null);

  // Función para alternar el estado abierto/cerrado
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Guardar en localStorage 4s después del último cambio en isOpen
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
    }, 4000);
    return () => clearTimeout(saveTimer);
  }, [isOpen]);

  // Auto-cerrar la barra 4s después de que se abra
  useEffect(() => {
    if (isOpen) {
      // Si ya había un temporizador pendiente, lo limpiamos
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
      // Creamos nuevo temporizador para cerrar la barra
      autoCloseRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    }
    // Limpiar el temporizador al desmontar o cambiar isOpen
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [isOpen]);

  /**
   * Devuelve el título basado en el pathname actual.
   * Se puede ampliar con más rutas según necesidad.
   */
  const getTitleFromPath = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/verificarPerfil":
        return "Verifica tu perfil";
      case "/resultados":
        return "Resultados reportes";
      case "/consultas":
        return "Consultas";
      default:
        return "Inicio";
    }
  };

  return (
    <>
      {/* Botón flotante para mostrar/ocultar la barra */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        style={{ left: isOpen ? "260px" : "1rem" }}
      >
        {/* Icono cambia según estado */}
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      {/* Contenedor de la barra: clases dinámicas según estado */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            {/* Título dinámico según ruta */}
            <h2 className="sidebar-title">
              {getTitleFromPath(location.pathname)}
            </h2>
            {/* Navegación principal */}
            <nav className="sidebar-nav">
              <ul>
                <li>
                  <Link to="/profileHistory">
                    <i className="bi bi-speedometer2"></i> Perfiles analizados
                  </Link>
                </li>
                <li>
                  <Link to="/verificarPerfil">
                    <i className="bi bi-person"></i> Verifica tu perfil
                  </Link>
                </li>
                <li>
                  <Link to="/resultados">
                    <i className="bi bi-file-earmark-text"></i> Resultados modelos entrenados
                  </Link>
                </li>
                <li>
                  <Link to="/consultas">
                    <i className="bi bi-question-circle"></i> Pregúntale al modelo
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Sección de usuario con email y botón de logout */}
            <div className="sidebar-user">
              <i className="bi bi-person-circle sidebar-user-icon"></i>
              <p className="sidebar-user-email">{user?.email || ''}</p>
              <LogoutButton />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
