import React from "react";  
import "./ErrorBox.css";  

// Componente funcional para mostrar mensajes de error o éxito 
export default function ErrorBox({ message, type = "danger" }) {
  // Si no hay mensaje, no renderiza nada
  if (!message) return null;

  // Si el tipo es 'success', aplicamos estilos inline para reforzar el estilo verde
  const inlineStyle =
    type === "success"
      ? {
          backgroundColor: "#d4edda", // verde claro de fondo
          color:           "#155724", // texto verde oscuro
          border:          "1px solid #c3e6cb", // borde verde medio
        }
      : {}; // para 'danger' o cualquier otro tipo dejamos estilos inline vacíos

  return (
    // Contenedor principal con clases base y específica por tipo
    <div
      className={`vp-error vp-error-${type}`}
      style={inlineStyle} // estilos inline en caso de éxito
    >
      {message} {/* Aquí se muestra el texto del mensaje */}
    </div>
  );
}
