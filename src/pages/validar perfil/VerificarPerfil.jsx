// src/pages/validar-perfil/VerificarPerfil.jsx
import React, { useState } from "react";
import "./stylesVerificarPerfil.css";
import Sidebar from "../../components/Sidebar";

function VerificarPerfil() {
  const API = process.env.REACT_APP_API_URL; 
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

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
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`  // si usas JWT
        },
        body: JSON.stringify({ username: uname }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
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
                      <a href={r.map_link} target="_blank" rel="noreferrer">
                        [Mapa]
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