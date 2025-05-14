import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./styleSidebar.css";
import LogoutButton from "./LogoutButton";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user } = useUser();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getTitleFromPath = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/verificarPerfil":
        return "Verifica tu perfil";
      case "/configuracion":
        return "Configuración";
      case "/reportes":
        return "Reportes";
      case "/consultas":
        return "Consultas";
      default:
        return "Inicio";
    }
  };

  return (
    <>
      {/* Botón toggle */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        style={{ left: isOpen ? "260px" : "1rem" }}
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {isOpen && (
          <>
            {/* Título dinámico */}
            <h2 className="sidebar-title">
              {getTitleFromPath(location.pathname)}
            </h2>

            {/* Sección del Menú - Mitad superior */}
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
                  <Link to="/configuracion">
                    <i className="bi bi-gear"></i> Configuración
                  </Link>
                </li>
                <li>
                  <Link to="/reportes">
                    <i className="bi bi-file-earmark-text"></i> Reportes
                  </Link>
                </li>
                <li>
                  <Link to="/consultas">
                    <i className="bi bi-question-circle"></i> Pregúntale al modelo
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Sección de Usuario - Mitad inferior */}
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

function SidebarLink({ to, icon, label }) {
  return (
    <Link to={to} className="sidebar-link">
      <i className={`bi ${icon}`}></i>
      {label}
    </Link>
  );
}

export default Sidebar;
