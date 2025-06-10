// src/pages/consultas/Consultas.jsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage";
import ErrorBox from "../../components/ErrorBox";
import "./stylesConsultas.css";

/**
 * Componente principal para la sección de "Consultas":
 * Permite al usuario enviar un texto al backend para analizar
 * si revela información sensible.
 */
function Consultas() {
  // URL base de la API configurada en variables de entorno
  const API = process.env.REACT_APP_API_URL;
  // Estado para almacenar el texto ingresado
  const [inputText, setInputText] = useState("");
  // Estado para el resultado de la consulta (label + score)
  const [result, setResult] = useState(null);
  // Hook para mensajes autodescartables (errores / warnings)
  const [error, setError] = useAutoDismissMessage(8000);
  // Estado para indicar que la petición está en curso
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Manejador del envío del formulario:
   * - Valida inputs y configuración de API
   * - Realiza fetch POST al endpoint de sentiment
   * - Maneja respuestas exitosas y errores
   */
  const handleSubmit = async (e) => {
    e.preventDefault();          // evita recarga de página
    setError(null);              // limpia posibles errores previos
    setIsLoading(true);          // activa indicador de carga

    // 1) Verificar que la URL de la API esté definida
    if (!API) {
      setError("⚠️ La URL del backend no está configurada.");
      setIsLoading(false);
      return;
    }

    // 2) Validar que el usuario haya ingresado texto
    if (!inputText.trim()) {
      setError("⚠️ Por favor, escribe un texto para analizar.");
      setIsLoading(false);
      return;
    }

    try {
      // Construir y llamar al endpoint de análisis
      const endpoint = `${API}/sentiment/predict`;
      const res = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text: inputText }),
      });

      // 3) Si la respuesta no es OK, manejar error detalladamente
      if (!res.ok) {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          throw new Error(errJson.detail || errJson.message);
        } else {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
      }

      // 4) Parsear JSON y guardar el resultado
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error en la consulta:", err);
      // Determinar si es warning (ej: carga) o error crítico
      const isWarn = err.message.toLowerCase().includes("cargando");
      setError(
        err.message || "Error al consultar el modelo",
        isWarn ? "warning" : "danger"
      );
      setResult(null);  // limpiar resultado anterior
    } finally {
      setIsLoading(false);  // desactivar indicador de carga
    }
  };

  return (
    <>
      {/* Sidebar con navegación */}
      <Sidebar />
      <div className="consultas-container">
        <div className="consultas-card">
          <h2>
            ¿Quieres saber si el caption de tu publicación revela información sensible?
          </h2>

          {/* Formulario de entrada de texto */}
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe una frase..."
              disabled={isLoading}
              rows={5}
            />

            {/* Botones de Analizar y Limpiar */}
            <div className="consultas-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Analizando...
                  </>
                ) : (
                  "Analizar"
                )}
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

          {/* Muestra errores o advertencias */}
          <ErrorBox
            message={error}
            type={
              error && error.toLowerCase().includes("cargando")
                ? "warning"
                : "danger"
            }
          />

          {/* Mostrar tarjeta de resultado si existe */}
          {result && (
            <div className="resultado mt-4">
              <h3>Resultado:</h3>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    {/* Etiqueta de clasificación */}
                    <div className="col-md-6">
                      <strong>Etiqueta:</strong>
                      <span
                        className={`badge ms-2 $
                          result.label === "Sensible"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {result.label}
                      </span>
                    </div>
                    {/* Puntuación numérica */}
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