import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./stylesConsultas.css";

function Consultas() {
  const API = process.env.REACT_APP_API_URL;
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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
      const res = await fetch(`${API}/sentiment/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Error al consultar el modelo");
      setResult(null);
      console.error("Error:", err);
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
            />
            <div className="consultas-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Analizando..." : "Analizar"}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
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

          {error && (
            <div className={`error-message ${error.includes("cargando") ? "warning-message" : ""}`}>
              {error}
              {error.includes("cargando") && (
                <div className="loading-model">
                  <p>Los modelos gratuitos de Hugging Face entran en estado de hibernación por inactividad.</p>
                  <p>Por favor, inténtalo de nuevo en 30 segundos.</p>
                </div>
              )}
            </div>
          )}

          {result && (
            <div className="resultado">
              <h3>Resultado:</h3>
              <table className="resultado-table">
                <thead>
                  <tr>
                    <th>Etiqueta</th>
                    <th>Puntuación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{result.label}</td>
                    <td>{result.score != null ? result.score.toFixed(4) : "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Consultas;