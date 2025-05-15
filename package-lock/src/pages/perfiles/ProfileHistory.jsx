// src/pages/perfiles/ProfileHistory.jsx
import { useState, useEffect } from "react";
import ResultadosTable from "../../components/ResultadoTable";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./stylesProfileHistory.css";

export default function ProfileHistory() {
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // 1) Carga inicial desde Firestore
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // 1. Referencia + Query ordenando por tu campo real "Fecha chequeo"
        const profilesCol = collection(db, "profiles");
        const q = query(
          profilesCol,
          orderBy("Fecha chequeo", "desc"),
          limit(1000)
        );
        const snapshot = await getDocs(q);

        // 2. Mapea cada doc a lo que tu tabla espera
        const docs = snapshot.docs.map((d) => {
          const data = d.data();

          // extrae label y score de tu string "Sensible (score: 0.76)"
          const m =
            data["Clasificación"].match(/(.+)\s*\(score:\s*([\d.]+)\)/i) || [];
          const label = m[1] || data["Clasificación"];
          const score = m[2] ? parseFloat(m[2]) : 0;

          return {
            id: d.id,
            username: data["Usuario"], // tu campo real
            classification: { label, score }, // objeto anidado
            checkedAt: data["Fecha chequeo"], // Firestore Timestamp
            reasons: (data["Razones"] || []).map((r) => ({
              detail: r.detalle, // adapta detalle → detail
              map_link: r.map_link, // ya existe map_link
            })),
          };
        });

        setAllProfiles(docs);
        setFilteredProfiles(docs);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los perfiles. Revisa la consola.");
      }
    };
    fetchProfiles();
  }, []);
  // 2) handleSearch
  const handleSearch = (e) => {
    e.preventDefault();
    let term = searchTerm.trim();
    // quita arroba inicial si la hay
    if (term.startsWith("@")) term = term.slice(1);
    if (term === "") {
      // vacío => muestra todo
      setFilteredProfiles(allProfiles);
      setError(null);
      return;
    }
    // filtra con contains (case-insensitive)
    const filtered = allProfiles.filter((p) =>
      p.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProfiles(filtered);
    if (filtered.length === 0) {
      setError(`No existen registros con el perfil “${searchTerm.trim()}”`);
    } else {
      setError(null);
    }
  };

  // 3) handleClear
  const handleClear = () => {
    setSearchTerm("");
    setFilteredProfiles(allProfiles);
    setError(null);
  };

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
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
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
          <ResultadosTable allResults={filteredProfiles} />
        </div>
      </div>
    </>
  );
}
