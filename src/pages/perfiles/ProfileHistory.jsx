// src/pages/perfiles/ProfileHistory.jsx

import { useState, useEffect } from "react";
import ResultadosTable from "../../components/ResultadoTable";
import Sidebar from "../../components/Sidebar";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./stylesProfileHistory.css";

export default function ProfileHistory() {
  const [allProfiles, setAllProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesCol = collection(db, "profiles");
        const q = query(profilesCol, limit(1000));
        const snapshot = await getDocs(q);

        const docs = snapshot.docs
          .map((d) => {
            const data = d.data();

            // 1) Fecha de chequeo preferida
            const fechaChequeoStr = data["Fecha chequeo"] ?? null;
            const processedAtStr = data.metadata?.processed_at ?? null;
            const date = fechaChequeoStr
              ? new Date(fechaChequeoStr)
              : processedAtStr
                ? new Date(processedAtStr)
                : null;

            // 2) Clasificación: parsear "Sensible (score: 0.76)"
            let label = "No sensible";
            let score = 0;
            const rawClass = data["Clasificación"] || data.classification?.label;
            if (typeof rawClass === "string") {
              // extraemos con regex
              const m = rawClass.match(/(.+)\s*\(score:\s*([\d.]+)\)/i);
              if (m) {
                label = m[1].trim();
                score = parseFloat(m[2]);
              } else {
                label = rawClass;
              }
            } else if (data.classification) {
              label = data.classification.label;
              score = data.classification.score;
            }

            // 3) Razones
            const rawRazones = data.Razones || data.razones || [];
            const reasons = rawRazones.map((r) => ({
              type: r.tipo ?? r.type,
              detail: r.detalle ?? r.detail,
              map_link: r.map_link ?? r.mapLink ?? null,
              extra: r.extra ?? null,
            }));

            return {
              id: d.id,
              username: d.id,
              classification: { label, score },
              checkedAt: date,
              reasons,
            };
          })
          // 4) Orden descendente por fecha real
          .sort((a, b) => {
            if (!a.checkedAt) return 1;
            if (!b.checkedAt) return -1;
            return b.checkedAt - a.checkedAt;
          });

        setAllProfiles(docs);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los perfiles. Revisa la consola.");
      }
    };

    fetchProfiles();
  }, []);

  // Filtrado + paginación
  const normalizedTerm = searchTerm.trim().replace(/^@/, "").toLowerCase();
  const filtered = normalizedTerm
    ? allProfiles.filter((p) =>
        p.username.toLowerCase().includes(normalizedTerm)
      )
    : allProfiles;

  const totalPages = Math.ceil(filtered.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentSlice = filtered.slice(startIdx, startIdx + perPage);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (!normalizedTerm) return setError(null);
    if (filtered.length === 0) {
      setError(`No existen registros con el perfil “${searchTerm.trim()}”`);
    } else {
      setError(null);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setError(null);
  };
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <Sidebar />
      <div className="ph-container">
        <h1 className="ph-title">Historial de perfiles</h1>

        <form className="ph-searchForm" onSubmit={handleSearch}>
          <input
            className="ph-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por username..."
          />
          <button className="ph-btn ph-search" type="submit">
            Buscar
          </button>
          <button
            className="ph-btn ph-clear"
            type="button"
            onClick={handleClear}
          >
            Limpiar
          </button>
        </form>

        {error && <div className="ph-error">{error}</div>}

        <div className="ph-results">
          <ResultadosTable allResults={currentSlice} />
        </div>

        {filtered.length > perPage && (
          <div className="ph-pagination">
            <button
              className="ph-pageBtn"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="ph-pageInfo">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="ph-pageBtn"
              onClick={goNext}
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
