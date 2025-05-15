import React from "react";
import Sidebar from "../../components/Sidebar";
import "./stylesDashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="info-card">
          <h2 className="info-card-title">🚀 ¿Sabías qué?</h2>
          <p className="info-card-text">
            El Procesamiento de Lenguaje Natural (PLN) se usa hoy en chatbots,
            asistentes virtuales, traducción automática y análisis de sentimiento,
            ¡todo gracias a redes neuronales y estadística!
          </p>
          <p className="info-card-invite">
            Y hoy vamos a ver su funcionamiento cuando lo usamos para realizar análisis
            de sentimientos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
