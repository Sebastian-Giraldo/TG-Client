import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./stylesConsultas.css";

function Consultas() {
  const API = process.env.REACT_APP_API_URL;
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/sentiment/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error al consultar el modelo:", err);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="consultas-container">
        <div className="consultas-card">
          <h2>¿Quieres saber si el caption de tú publicación revela información sensible?</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe una frase..."
            />
            <div className="consultas-buttons">
              <button type="submit" className="btn btn-primary">Analizar</button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setInputText("");
                  setResult(null);
                }}
              >
                Limpiar
              </button>
            </div>
          </form>

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
                  {result.map((row, i) => (
                    <tr key={i}>
                      <td>{row.label}</td>
                      <td>{row.score.toFixed(4)}</td>
                    </tr>
                  ))}
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
