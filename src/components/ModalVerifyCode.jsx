import React from "react";

// Importa los estilos específicos para este modal
import "./stylesVerificarPerfil.css";

// Componente Sidebar para navegación lateral
import Sidebar from "../../components/Sidebar";

/**
 * Componente ModalVerifyCode:
 * Muestra un modal superpuesto donde el usuario ingresa
 * el código de 6 dígitos que se envió por correo
 */
export default function ModalVerifyCode({
  email,         // Dirección de correo donde se envió el código
  inputCode,     // Valor actual del input del código
  setInputCode,  // Función para actualizar el valor del input
  codeError,     // Mensaje de error si el código es inválido
  onVerify,      // Callback que verifica y crea la cuenta
  onClose,       // Callback para cerrar el modal
}) {
  return (
    <>
      {/* Capa semitransparente detrás del modal; cierra al hacer clic */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />

      {/* Contenedor principal del modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content">
            {/* Encabezado del modal */}
            <div className="modal-header">
              <h5 className="modal-title">Verificación de correo</h5>
              {/* Botón para cerrar modal */}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            {/* Cuerpo del modal */}
            <div className="modal-body">
              <p>
                Hemos enviado un código de 6 dígitos a <b>{email}</b>.<br />
                Por favor, introdúcelo:
              </p>
              {/* Input para ingresar solamente dígitos, enfoque automático */}
              <input
                type="text"
                className="form-control form-control-sm w-auto mx-auto"
                maxLength={6}
                value={inputCode}
                onChange={(e) =>
                  setInputCode(e.target.value.replace(/\D/g, ""))
                }
                autoFocus
              />
              {/* Mensaje de error si el código es incorrecto */}
              {codeError && (
                <div className="text-danger mt-2 text-center">
                  {codeError}
                </div>
              )}
            </div>

            {/* Pie de modal con acciones */}
            <div className="modal-footer">
              {/* Botón para cerrar */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
              {/* Botón para verificar y crear cuenta */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={onVerify}
              >
                Verificar y crear cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
