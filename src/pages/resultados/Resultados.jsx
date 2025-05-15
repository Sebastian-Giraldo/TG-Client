import React from "react";
import Sidebar from "../../components/Sidebar";
import "./stylesResultados.css";

export default function Resultados() {
  return (
    <div className="resultados-container">
      <Sidebar />

      <div className="resultados-content">
        <h1 className="resultados-title">Resultados de la Clasificación</h1>

        <div className="models-grid">
          {/* Modelo BETO */}
          <div className="model-block">
            <h2>Modelo BETO</h2>

            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/confusion_matrix_beto.png"
                  alt="Matriz de Confusión BETO"
                />
              </div>
              <p className="image-desc">
                <strong>1790</strong> verdaderos negativos y <strong>1210</strong>{" "}
                verdaderos positivos, sin falsos positivos ni negativos.
              </p>
            </div>

            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/classification_metrics_beto.png"
                  alt="Métricas por Clase BETO"
                />
              </div>
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

          {/* Modelo RoBERTa */}
          <div className="model-block">
            <h2>Modelo RoBERTa</h2>

            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/confusion_matrix_roberta.png"
                  alt="Matriz de Confusión RoBERTa"
                />
              </div>
              <p className="image-desc">
                <strong>6180</strong> negativos bien, <strong>5409</strong>{" "}
                positivos bien, <strong>771</strong> falsos negativos.
              </p>
            </div>

            <div className="image-card">
              <div className="image-wrapper">
                <img
                  src="/img/classification_metrics_roberta.png"
                  alt="Métricas por Clase RoBERTa"
                />
              </div>
              <p className="image-desc">
                – Precisión en “Sensible” 1.0 (todas las predicciones correctas).<br />
                – Recall en “Sensible” ~0.87 (detectó el 87% de los reales).<br />
                – F1-score ~0.94 (balance precisión/recall).<br />
                En “No Sensible” precisión y recall ~0.89.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
