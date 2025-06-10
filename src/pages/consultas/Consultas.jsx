// src/pages/consultas/Consultas.jsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage";
import ErrorBox from "../../components/ErrorBox";
import "./stylesConsultas.css";

function Consultas() {
  const API = process.env.REACT_APP_API_URL;
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useAutoDismissMessage(8000);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!API) {
      setError("⚠️ La URL del backend no está configurada.");
      setIsLoading(false);
      return;
    }

    if (!inputText.trim()) {
      setError("⚠️ Por favor, escribe un texto para analizar.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = `${API}/sentiment/predict`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          throw new Error(errJson.detail || errJson.message);
        } else {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error en la consulta:", err);
      // definir tipo según contenido del mensaje
      const isWarn = err.message.toLowerCase().includes("cargando");
      setError(err.message || "Error al consultar el modelo", isWarn ? "warning" : "danger");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="consultas-container">
        <div className="consultas-card">
          <h2>
            ¿Quieres saber si el caption de tu publicación revela información sensible?
          </h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe una frase..."
              disabled={isLoading}
              rows={5}
            />
            
            <div className="consultas-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Analizando...
                  </>
                ) : "Analizar"}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setInputText("");
                  setResult(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Limpiar
              </button>
            </div>
          </form>

          <ErrorBox 
            message={error} 
            type={error && error.toLowerCase().includes("cargando") ? "warning" : "danger"} 
          />

          {result && (
            <div className="resultado mt-4">
              <h3>Resultado:</h3>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Etiqueta:</strong> 
                      <span className={`badge ${
                        result.label === "Sensible" 
                          ? "bg-danger" 
                          : "bg-success"
                      } ms-2`}>
                        {result.label}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong>Puntuación:</strong> 
                      <span className="ms-2 score-text">
                        {result.score != null 
                          ? result.score.toFixed(4) 
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Consultas;
