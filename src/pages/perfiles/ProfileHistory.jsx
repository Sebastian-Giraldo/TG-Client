// src/pages/perfiles/ProfileHistory.jsx
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";                   // Componente para navegación lateral
import { collection, getDocs, query, limit } from "firebase/firestore";// Funciones para consultar Firestore
import { db } from "../../firebase/firebase";                     // Referencia a la BD Firestore inicializada
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage"; // Hook para mensajes que desaparecen solos
import ErrorBox from "../../components/ErrorBox";                 // Componente de alertas
import "./stylesProfileHistory.css";                              // Estilos específicos

/**
 * ProfileHistory:
 * - Consulta perfiles almacenados en Firestore
 * - Permite buscar por username y paginar resultados
 * - Muestra clasificación, fecha, razones y enlace a mapa
 */
export default function ProfileHistory() {
  // Listado completo de perfiles traídos de Firestore
  const [allProfiles, setAllProfiles] = useState([]);
  // Término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm]     = useState("");
  // Estado para mostrar errores o mensajes (autodismiss)
  const [error, setError]               = useAutoDismissMessage(8000);
  // Paginación: página actual y items por página
  const [currentPage, setCurrentPage]   = useState(1);
  const perPage = 5;

  /**
   * useEffect para cargar los perfiles al montar el componente
   * - Limita a 1000 documentos
   * - Parsea clasificación, razones y fecha
   * - Ordena por fecha descendente
   */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "profiles"), limit(1000))
        );

        // Transformamos cada doc en objeto con estructura deseada
        const docs = snap.docs
          .map((d) => {
            const data = d.data();

            // ——— Parseo de clasificación ———
            let rawClass = data["Clasificación"] || data.classification?.label;
            let label = "No sensible", score = 0;
            if (typeof rawClass === "string") {
              // Formato "Etiqueta (score:0.85)"
              const m = rawClass.match(/(.+)\s*\(score:\s*([\d.]+)\)/i);
              if (m) {
                label = m[1].trim();
                score = parseFloat(m[2]);
              } else {
                label = rawClass.trim();
              }
            } else if (data.classification) {
              label = data.classification.label;
              score = data.classification.score;
            }

            // ——— Parseo de razones ———
            const rawRazones = data.Razones || data.razones || [];
            const reasons = rawRazones.map((r) => {
              // Extraemos texto de la razón
              const detail = typeof r === "string" ? r : r.detalle ?? r.detail ?? "";
              // Buscamos link de mapa si existe
              let map_link = r.map_link ?? r.mapLink ?? null;
              // Si no lo trae, extraemos de texto "Ubicación mostrada: X"
              if (!map_link) {
                const loc = detail.match(/Ubicación mostrada:\s*(.+)/i);
                if (loc) {
                  map_link =
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      loc[1]
                    )}`;
                }
              }
              return { detail, map_link };
            });

            // ——— Fecha de chequeo ———
            const fechaStr =
              data["Fecha chequeo"] ?? data.metadata?.processed_at ?? null;
            const checkedAt = fechaStr ? new Date(fechaStr) : null;

            return {
              id: d.id,
              username: d.id,
              classification: { label, score },
              reasons,
              checkedAt,
            };
          })
          // Orden descendente por fecha
          .sort((a, b) => (b.checkedAt || 0) - (a.checkedAt || 0));

        setAllProfiles(docs); // Guardamos en estado
        setError(null);       // Limpiamos errores previos
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los perfiles. Revisa la consola.");
      }
    })();
  }, [setError]);

  // ——— Filtrado y paginación ———
  const norm = searchTerm.trim().replace(/^@/, "").toLowerCase();
  const filtered = norm
    ? allProfiles.filter((p) => p.username.toLowerCase().includes(norm))
    : allProfiles;
  const totalPages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <>
      <Sidebar /> {/* Barra lateral */}

      <div className="ph-container">
        <h1 className="ph-title">Historial de perfiles</h1>

        {/* Formulario de búsqueda */}
        <form
          className="ph-searchForm"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setCurrentPage(1);
          }}
        >
          <input
            className="ph-input"
            placeholder="Buscar por username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="ph-btn ph-search">Buscar</button>
          <button
            className="ph-btn ph-clear"
            type="button"
            onClick={() => {
              setSearchTerm("");
              setError(null);
              setCurrentPage(1);
            }}
          >
            Limpiar
          </button>
        </form>

        {/* Mensaje de error */}
        <ErrorBox message={error} type="danger" />

        {/* Tabla de resultados */}
        <div className="ph-results">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Clasificación</th>
                <th>Fecha de chequeo</th>
                <th>Razones</th>
                <th>Mapa</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((p) => {
                const { label, score } = p.classification;
                // Definimos sensible sólo si label === "sensible"
                const isSensitive = label.trim().toLowerCase() === "sensible";

                return (
                  <tr key={p.id}>
                    <td>{p.username}</td>
                    {/* Badge y score en línea */}
                    <td className="ph-classification-cell">
                      <span
                        className={`ph-badge ${
                          isSensitive ? "ph-badge-danger" : "ph-badge-success"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="ph-score">{score.toFixed(2)}</span>
                    </td>
                    <td>{p.checkedAt ? p.checkedAt.toLocaleString() : "--"}</td>
                    <td>
                      {p.reasons.length ? (
                        <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                          {p.reasons.map((r, i) => (
                            <li key={i}>{r.detail}</li>
                          ))}
                        </ul>
                      ) : (
                        "--"
                      )}
                    </td>
                    <td>
                      {p.reasons.some((r) => r.map_link) ? (
                        <a
                          className="ph-map-btn"
                          href={
                            p.reasons.find((r) => r.map_link).map_link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver en el mapa
                        </a>
                      ) : (
                        "--"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="ph-pagination">
            <button
              className="ph-pageBtn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="ph-pageInfo">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="ph-pageBtn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </>
  );
}