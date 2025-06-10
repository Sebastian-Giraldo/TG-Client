// src/pages/resultados/Resultados.jsx
import React from "react";
import Sidebar from "../../components/Sidebar"; // Componente de navegación lateral\ nimport "./stylesResultados.css"; // Estilos específicos de la página

/**
 * Componente Resultados:
 * - Muestra los resultados de clasificación de dos modelos
 * - Incluye matrices de confusión y métricas por clase
 */
export default function Resultados() {
  return (
    <div className="resultados-container">
      {/* Sidebar para navegación */}
      <Sidebar />

      <div className="resultados-content">
        {/* Título de la sección */}
        <h1 className="resultados-title">Resultados de la Clasificación</h1>

        {/* Grid de bloques para cada modelo */}
        <div className="models-grid">
          {/* Bloque del Modelo BETO */}
          <div className="model-block">
            <h2>Modelo BETO</h2>

            {/* Tarjeta de imagen: Matriz de Confusión */}
            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/confusion_matrix_beto.png"
                  alt="Matriz de Confusión BETO"
                />
              </div>
              {/* Descripción de la matriz */}
              <p className="image-desc">
                <strong>1790</strong> verdaderos negativos y <strong>1210</strong>{" "}
                verdaderos positivos, sin falsos positivos ni negativos.
              </p>
            </div>

            {/* Tarjeta de imagen: Métricas por clase */}
            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/classification_metrics_beto.png"
                  alt="Métricas por Clase BETO"
                />
              </div>
              {/* Descripción de métricas */}
              <p className="image-desc">
                – <strong>Precisión</strong>: proporción de predicciones positivas
                correctas.<br />
                – <strong>Recall</strong>: proporción de positivos reales
                correctamente detectados.<br />
                – <strong>F1-score</strong>: media armónica entre precisión y
                recall.<br />
                Todas las métricas son 1.0.
              </p>
            </div>
          </div>

          {/* Bloque del Modelo RoBERTa */}
          <div className="model-block">
            <h2>Modelo RoBERTa</h2>

            {/* Tarjeta de imagen: Matriz de Confusión */}
            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/confusion_matrix_roberta.png"
                  alt="Matriz de Confusión RoBERTa"
                />
              </div>
              {/* Descripción de la matriz */}
              <p className="image-desc">
                <strong>6180</strong> negativos bien, <strong>5409</strong>{" "}
                positivos bien, <strong>771</strong> falsos negativos.
              </p>
            </div>

            {/* Tarjeta de imagen: Métricas por clase */}
            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/classification_metrics_roberta.png"
                  alt="Métricas por Clase RoBERTa"
                />
              </div>
              {/* Descripción de métricas */}
              <p className="image-desc">
                – <strong>Precisión</strong> en “Sensible” 1.0 (todas las predicciones correctas).<br />
                – <strong>Recall</strong> en “Sensible” ~0.87 (detectó el 87% de los reales).<br />
                – <strong>F1-score</strong> ~0.94 (balance precisión/recall).<br />
                En “No Sensible” precisión y recall ~0.89.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
