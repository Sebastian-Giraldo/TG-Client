import React from "react";
import PropTypes from "prop-types";

/**
 * Componente ResultadoTable:
 * - Recibe un array "allResults" con objetos de resultados.
 * - Si no hay resultados, muestra un mensaje indicándolo.
 * - Si hay, renderiza una tabla con los datos:
 *   Usuario, clasificación, fecha, razones y botones de mapa.
 */
export default function ResultadoTable({ allResults }) {
  // 1) Si el array está vacío o no existe, mostrar mensaje alternativo
  if (!allResults || allResults.length === 0) {
    return <p>No hay resultados para mostrar.</p>;
  }

  // 2) Si hay resultados, construimos la tabla
  return (
    // Contenedor para scroll horizontal en pantallas pequeñas
    <div style={{ overflowX: "auto" }}>
      <table className="table table-striped">
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
          {allResults.map((res, idx) => (
            <tr key={idx}>
              {/* Columna Usuario */}
              <td>{res.username}</td>
              {/* Columna Clasificación: label (score) */}
              <td>
                {res.classification.label} (
                {res.classification.score.toFixed(2)})
              </td>
              {/* Columna Fecha de chequeo: formateada a locale */}
              <td>{new Date(res.checkedAt).toLocaleString()}</td>
              {/* Columna Razones: lista de detalles */}
              <td>
                <ul className="mb-0">
                  {res.reasons.map((r, i) => (
                    <li key={i}>{r.detail}</li>
                  ))}
                </ul>
              </td>
              {/* Columna Mapa: uno o más botones si hay enlaces map_link */}
              <td>
                {res.reasons
                  .filter((r) => r.map_link)
                  .map((r, i) => (
                    <a
                      key={i}
                      href={r.map_link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      Ver mapa
                    </a>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Validación de props con PropTypes para documentar y evitar errores
ResultadoTable.propTypes = {
  allResults: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      classification: PropTypes.shape({
        label: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
      }).isRequired,
      checkedAt: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      reasons: PropTypes.arrayOf(
        PropTypes.shape({
          detail: PropTypes.string.isRequired,
          map_link: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};
