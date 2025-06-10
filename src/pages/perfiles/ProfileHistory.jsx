// src/pages/perfiles/ProfileHistory.jsx
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage";
import ErrorBox from "../../components/ErrorBox";
import "./stylesProfileHistory.css";

export default function ProfileHistory() {
  const [allProfiles, setAllProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useAutoDismissMessage(8000);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "profiles"), limit(1000))
        );

        const docs = snap.docs
          .map((d) => {
            const data = d.data();

            // ————— Parseo de clasificación —————
            let rawClass = data["Clasificación"] || data.classification?.label;
            let label = "No sensible", score = 0;
            if (typeof rawClass === "string") {
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

            // ————— Parseo de razones —————
            const rawRazones = data.Razones || data.razones || [];
            const reasons = rawRazones.map((r) => {
              // extraemos el texto de la razón
              const detail =
                typeof r === "string"
                  ? r
                  : r.detalle ?? r.detail ?? "";
              // miramos si viene con link
              let map_link = r.map_link ?? r.mapLink ?? null;
              // si no viene link pero el texto tiene "Ubicación mostrada: X"
              if (!map_link) {
                const loc = detail.match(/Ubicación mostrada:\s*(.+)/i);
                if (loc) {
                  map_link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    loc[1]
                  )}`;
                }
              }
              return { detail, map_link };
            });

            // ————— Fecha de chequeo —————
            const fechaStr =
              data["Fecha chequeo"] ??
              data.metadata?.processed_at ??
              null;
            const checkedAt = fechaStr ? new Date(fechaStr) : null;

            return {
              id: d.id,
              username: d.id,
              classification: { label, score },
              reasons,
              checkedAt,
            };
          })
          .sort((a, b) => (b.checkedAt || 0) - (a.checkedAt || 0));

        setAllProfiles(docs);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los perfiles. Revisa la consola.");
      }
    })();
  }, [setError]);

  // ————— Filtrado + paginación —————
  const norm = searchTerm.trim().replace(/^@/, "").toLowerCase();
  const filtered = norm
    ? allProfiles.filter((p) =>
      p.username.toLowerCase().includes(norm)
    )
    : allProfiles;
  const totalPages = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
  <>
    <Sidebar />
    <div className="ph-container">
      <h1 className="ph-title">Historial de perfiles</h1>

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

      <ErrorBox message={error} type="danger" />

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
              const isSensitive =
                label.trim().toLowerCase() === "sensible";

              return (
                <tr key={p.id}>
                  <td>{p.username}</td>

                  {/* Clasificación: badge + score en una sola línea */}
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
                    <span className="ph-score">
                      {score.toFixed(2)}
                    </span>
                  </td>

                  <td>
                    {p.checkedAt
                      ? p.checkedAt.toLocaleString()
                      : "--"}
                  </td>

                  <td>
                    {p.reasons.length > 0 ? (
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

      {totalPages > 1 && (
        <div className="ph-pagination">
          <button
            className="ph-pageBtn"
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="ph-pageInfo">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="ph-pageBtn"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
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
