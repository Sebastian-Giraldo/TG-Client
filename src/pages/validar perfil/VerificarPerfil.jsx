import { useState, useEffect } from "react";

import "./stylesVerificarPerfil.css";
import Sidebar from "../../components/Sidebar";

function VerificarPerfil() {
  const API = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [result, setResult]     = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const cleanUser = (u) => u.trim().replace(/^@+/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const uname = cleanUser(username);
    if (!uname) return setError("Ingresa un usuario válido");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/verificar-perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname }),
      });
      if (!res.ok) {
        const ct = res.headers.get("Content-Type") || "";
        if (ct.includes("application/json")) {
          const err = await res.json();
          const d = err.detail || "";
          if (d.includes("401") && d.includes("Please wait")) {
            throw new Error(
              "Instagram bloqueó temporalmente la consulta. Por favor, intenta de nuevo en unos minutos."
            );
          } else {
            throw new Error("Error del servidor: " + d);
          }
        } else {
          const text = await res.text();
          throw new Error(text || "Error desconocido");
        }
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error("Error en la verificación:", e);
      setError(e.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="vp-container">
        <div className="vp-card">
          <h2>Verificar perfil de Instagram</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="ej. @mi_perfil"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Cargando…" : "Verificar"}
            </button>
          </form>

          {loading && (
            <div className="loading-message">
              <p>Cargando modelo...</p>
              <p>Esto puede tardar unos segundos.</p>
            </div>
          )}

          {error && <div className="vp-error">{error}</div>}

          {result && (
            <div className="vp-result">
              <h3>
                Estado:{" "}
                {result.classification.label === "Sensible" ? (
                  <span className="vp-badge sens">Sensible</span>
                ) : (
                  <span className="vp-badge safe">Sin riesgo</span>
                )}
              </h3>

              <ul className="vp-reasons">
                {result.reasons.map((r, i) => (
                  <li key={i}>
                    {r.detail}{" "}
                    {r.map_link && (
                      <a
                        className="vp-map-btn"
                        href={r.map_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver en el mapa
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VerificarPerfil;
