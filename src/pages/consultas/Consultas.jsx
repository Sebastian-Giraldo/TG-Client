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
      const endpoint = `${API}/sentiment/predict`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Error ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Error al consultar el modelo");
      setResult(null);
      console.error("Error en la consulta:", err);
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

          {/* Mensajes de error mejorados */}
          {error && (
            <div className={`alert ${error.includes("cargando") ? "alert-warning" : "alert-danger"} mt-3`}>
              {error}
              {error.includes("cargando") && (
                <div className="mt-2">
                  <p>Los modelos gratuitos de Hugging Face pueden entrar en estado de hibernación.</p>
                  <p>Por favor, inténtalo de nuevo en 30 segundos.</p>
                </div>
              )}
            </div>
          )}

          {/* Resultados */}
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
                      <span className="ms-2">
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