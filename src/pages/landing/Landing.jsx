import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="text-primary">Bienvenido 🚀</h1>
        <p className="mt-4 lead">
          Prototipo de software web para el análisis y evaluación de la
          exposición de datos con Procesamiento de Lenguaje Natural (PLN)
        </p>
        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>
          <Link to="/register" className="btn btn-outline-primary">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
