import React from "react";
import "./ErrorBox.css";

export default function ErrorBox({ message, type = "danger" }) {
  if (!message) return null;

  // Estilos inline como refuerzo para el success
  const inlineStyle =
    type === "success"
      ? {
          backgroundColor: "#d4edda",
          color:           "#155724",
          border:          "1px solid #c3e6cb",
        }
      : {};

  return (
    <div
      className={`vp-error vp-error-${type}`}
      style={inlineStyle}
    >
      {message}
    </div>
  );
}
