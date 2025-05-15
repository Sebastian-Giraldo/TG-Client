import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./stylesConsultas.css";

function Consultas() {
  const API = process.env.REACT_APP_API_URL;
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!API) {
      setError("⚠️ La URL del backend no está configurada.");
      return;
    }

    if (!inputText.trim()) {
      setError("⚠️ Por favor, escribe un texto para analizar.");
      return;
    }

    try {
      const res = await fetch(`${API}/sentiment/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("Error al consultar el modelo: " + err.message);
      setResult(null);
      console.error("Error al consultar el modelo:", err);
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
            />
            <div className="consultas-buttons">
              <button type="submit" className="btn btn-primary">
                Analizar
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setInputText("");
                  setResult(null);
                  setError(null);
                }}
              >
                Limpiar
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}

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
