// src/components/ResultadoTable.jsx
import React from "react";
import PropTypes from "prop-types";

export default function ResultadoTable({ allResults }) {
  if (!allResults || allResults.length === 0) {
    return <p>No hay resultados para mostrar.</p>;
  }

  return (
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
              <td>{res.username}</td>
              <td>
                {res.classification.label} (
                {res.classification.score.toFixed(2)})
              </td>
              <td>{new Date(res.checkedAt).toLocaleString()}</td>
              <td>
                <ul className="mb-0">
                  {res.reasons.map((r,i) => (
                    <li key={i}>{r.detail}</li>
                  ))}
                </ul>
              </td>
              <td>
                {res.reasons
                  .filter(r => r.map_link)
                  .map((r,i) => (
                    <a
                      key={i}
                      href={r.map_link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      Ver mapa
                    </a>
                  ))
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ResultadoTable.propTypes = {
  allResults: PropTypes.arrayOf(
    PropTypes.shape({
      username:      PropTypes.string.isRequired,
      classification: PropTypes.shape({
        label: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
      }).isRequired,
      checkedAt: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      reasons: PropTypes.arrayOf(
        PropTypes.shape({
          detail:   PropTypes.string.isRequired,
          map_link: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};
