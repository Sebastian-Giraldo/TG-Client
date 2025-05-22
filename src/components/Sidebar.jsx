import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./styleSidebar.css";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-open");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const location = useLocation();
  const { user } = useUser();

  // 1) Creamos el ref sin anotación de tipo
  const autoCloseRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((o) => !o);
  };

  // 2) Guardar en localStorage 4s después del último cambio
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
    }, 4000);

    return () => clearTimeout(saveTimer);
  }, [isOpen]);

  // 3) Auto-cerrar 4s después de abrirlo
  useEffect(() => {
    if (isOpen) {
      // limpia cualquier timer anterior
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);

      autoCloseRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 4000);
    }

    // limpia al desmontar o al cambiar isOpen
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [isOpen]);

  // Sin anotaciones de tipo
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
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        style={{ left: isOpen ? "260px" : "1rem" }}
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            <h2 className="sidebar-title">
              {getTitleFromPath(location.pathname)}
            </h2>
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