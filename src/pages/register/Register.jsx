// src/pages/perfiles/ProfileHistory.jsx
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";                          // Componente de navegación lateral\ nimport { collection, getDocs, query, limit } from "firebase/firestore";   // Funciones para leer datos de Firestore
import { db } from "../../firebase/firebase";                            // Referencia a la instancia de Firestore
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage"; // Hook para mostrar alertas que desaparecen automáticamente
import ErrorBox from "../../components/ErrorBox";                        // Componente para mostrar mensajes de error
import "./stylesProfileHistory.css";                                     // Estilos específicos de la página

/**
 * ProfileHistory:
 *  - Consulta y muestra el historial de perfiles analizados
 *  - Permite buscar por username y navegar por páginas de resultados
 *  - Muestra clasificación, fecha de chequeo, razones y enlace a mapa
 */
export default function ProfileHistory() {
  // Estado con el listado completo de perfiles obtenidos de Firestore
  const [allProfiles, setAllProfiles] = useState([]);
  // Texto ingresado por el usuario para filtrar usernames
  const [searchTerm, setSearchTerm]     = useState("");
  // Estado para manejar mensajes de error (autocancelables)
  const [error, setError]               = useAutoDismissMessage(8000);
  // Paginación: página actual y cantidad de items por página
  const [currentPage, setCurrentPage]   = useState(1);
  const perPage = 5;

  /**
   * Efecto para cargar la lista de perfiles al montar el componente:
   * 1) Solicita hasta 1000 documentos de la colección "profiles".
   * 2) Para cada doc, parsea:
   *    - Label y score de clasificación (manejando diferentes formatos).
   *    - Lista de razones, extrayendo detalle y link de mapa si existe.
   *    - Fecha de chequeo, usando campo personalizado o metadata.
   * 3) Ordena los perfiles por fecha (descendente).
   * 4) Almacena los resultados en el estado y limpia posibles errores.
   */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "profiles"), limit(1000))
        );

        const docs = snap.docs
          .map((d) => {
            const data = d.data();

            // ---- Parseo de clasificación ----
            let rawClass = data["Clasificación"] || data.classification?.label;
            let label = "No sensible", score = 0;
            if (typeof rawClass === "string") {
              // Intenta extraer label y score de un string como "Etiqueta (score:0.85)"
              const m = rawClass.match(/(.+)\s*\(score:\s*([\d.]+)\)/i);
              if (m) {
                label = m[1].trim();
                score = parseFloat(m[2]);
              } else {
                // Si no tiene formato de score, usa el texto completo como label
                label = rawClass.trim();
              }
            } else if (data.classification) {
              // Si viene como objeto, usa sus campos
              label = data.classification.label;
              score = data.classification.score;
            }

            // ---- Parseo de razones ----
            const rawRazones = data.Razones || data.razones || [];
            const reasons = rawRazones.map((r) => {
              // Extrae el texto de la razón (string o campo detalle)
              const detail =
                typeof r === "string" ? r : r.detalle ?? r.detail ?? "";
              // Busca un link de mapa si existe en la propiedad map_link o mapLink
              let map_link = r.map_link ?? r.mapLink ?? null;
              // Si no tiene link, intenta extraerlo de un texto que contenga "Ubicación mostrada: X"
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

            // ---- Parseo de fecha de chequeo ----
            const fechaStr =
              data["Fecha chequeo"] ?? data.metadata?.processed_at ?? null;
            const checkedAt = fechaStr ? new Date(fechaStr) : null;

            // Devuelve objeto estandarizado para cada perfil
            return {
              id: d.id,
              username: d.id,
              classification: { label, score },
              reasons,
              checkedAt,
            };
          })
          // Orden descendente por fecha (más reciente primero)
          .sort((a, b) => (b.checkedAt || 0) - (a.checkedAt || 0));

        // Actualiza el estado con los perfiles procesados
        setAllProfiles(docs);
        // Limpia cualquier mensaje de error anterior
        setError(null);
      } catch (err) {
        console.error(err);
        // Muestra mensaje de error si falla la consulta
        setError("No se pudieron cargar los perfiles. Revisa la consola.");
      }
    })();
  }, [setError]);

  /**
   * Filtrado y paginación:
   * - Normaliza el término de búsqueda (sin @ y en minúsculas)
   * - Filtra el array allProfiles
   * - Calcula totalPages y slice de items para la página actual
   */
  const norm = searchTerm.trim().replace(/^@/, "").toLowerCase();
  const filtered = norm
    ? allProfiles.filter((p) => p.username.toLowerCase().includes(norm))
    : allProfiles;
  const totalPages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <>
      <Sidebar /> {/* Navegación lateral */}

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

        {/* Muestra mensaje de error si existe */}
        <ErrorBox message={error} type="danger" />

        {/* Tabla con resultados */}
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
                // Determina si es totalmente 'sensible'
                const isSensitive = label.trim().toLowerCase() === "sensible";

                return (
                  <tr key={p.id}>
                    {/* Usuario */}
                    <td>{p.username}</td>

                    {/* Clasificación: badge y score juntos */}
                    <td className="ph-classification-cell">
                      <span
                        className={`ph-badge ${
                          isSensitive
                            ? "ph-badge-danger"
                            : "ph-badge-success"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="ph-score">{score.toFixed(2)}</span>
                    </td>

                    {/* Fecha de chequeo, o '--' si no hay*/}
                    <td>{p.checkedAt ? p.checkedAt.toLocaleString() : "--"}</td>

                    {/* Lista de razones, o '--' si no hay ninguna*/}
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

                    {/* Botón 'Ver en el mapa' si hay algún map_link*/}
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

        {/* Controles de paginación si hay más de una página */}
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