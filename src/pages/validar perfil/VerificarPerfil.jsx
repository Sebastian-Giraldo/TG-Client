// src/pages/validar-perfil/VerificarPerfil.jsx
import React, { useState, useEffect } from "react";

import "./stylesVerificarPerfil.css";  // Estilos específicos para este componente
import Sidebar from "../../components/Sidebar";  // Componente de navegación lateral

/**
 * Componente VerificarPerfil:
 * Permite al usuario ingresar un nombre de perfil de Instagram,
 * envía la solicitud de verificación al backend,
 * y muestra el estado y razones de la clasificación.
 */
 function VerificarPerfil() {
  // URL base de la API obtenida de variables de entorno
  const API = process.env.REACT_APP_API_URL;

  // Estados locales
  const [username, setUsername] = useState("");  // Texto del input de usuario
  const [loading, setLoading]   = useState(false); // Flag de carga de la petición
  const [error, setError]       = useState(null);  // Mensaje de error a mostrar
  const [result, setResult]     = useState(null);  // Objeto con los datos retornados

  /**
   * Limpia automáticamente el mensaje de error tras 8 segundos
   */
  useEffect(() => {
    if (!error) return;          // Si no hay error, no hacer nada
    const timer = setTimeout(() => setError(null), 8000);
    return () => clearTimeout(timer);  // Limpia el timer al desmontar o cambiar error
  }, [error]);

  /**
   * Normaliza el nombre de usuario: quita espacios y '@' al inicio
   */
  const cleanUser = (u) => u.trim().replace(/^@+/, "");

  /**
   * handleSubmit:
   * - Previene comportamiento por defecto del form
   * - Limpia errores y resultados previos
   * - Valida que haya un username válido
   * - Llama al endpoint de verificación y maneja la respuesta
   */
  const handleSubmit = async (e) => {
    e.preventDefault();         // Evita recarga de página
    setError(null);             // Limpia mensaje de error
    setResult(null);            // Limpia resultado previo

    // Normalizamos y validamos el username
    const uname = cleanUser(username);
    if (!uname) {
      setError("Ingresa un usuario válido");
      return;
    }

    setLoading(true);            // Activamos indicador de carga
    try {
      // Realizamos la petición POST al backend
      const res = await fetch(`${API}/api/verificar-perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname }),
      });

      // Si la respuesta no es OK, extraemos detalles de error
      if (!res.ok) {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          const detail = errJson.detail || "";
          // Manejo específico de bloqueo 401 de Instagram
          if (detail.includes("401") && detail.includes("Please wait")) {
            throw new Error(
              "Instagram bloqueó temporalmente la consulta. Por favor, intenta de nuevo en unos minutos."
            );
          }
          throw new Error("Error del servidor: " + detail);
        } else {
          const text = await res.text();
          throw new Error(text || "Error desconocido");
        }
      }

      // Parseamos la respuesta JSON y guardamos en result
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error en la verificación:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);         // Desactivamos indicador de carga
    }
  };

  return (
    <>
      {/* Navegación lateral */}
      <Sidebar />

      <div className="vp-container">
        <div className="vp-card">
          <h2>Verificar perfil de Instagram</h2>

          {/* Formulario para ingresar el usuario */}
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

          {/* Indicador mientras se procesa la petición */}
          {loading && (
            <div className="loading-message">
              <p>Cargando modelo...</p>
              <p>Esto puede tardar unos segundos.</p>
            </div>
          )}

          {/* Muestra mensaje de error si existe */}
          {error && <div className="vp-error">{error}</div>}

          {/* Muestra los resultados cuando estén disponibles */}
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

              {/* Lista de razones y enlace a mapa si aplica */}
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
