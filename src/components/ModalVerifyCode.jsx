import React from "react";

export default function ModalVerifyCode({
  email,
  inputCode,
  setInputCode,
  codeError,
  onVerify,
  onClose,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />

      {/* Modal */}
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
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Verificación de correo</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p>
                Hemos enviado un código de 6 dígitos a <b>{email}</b>.<br />
                Por favor, introdúcelo:
              </p>
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
              {codeError && (
                <div className="text-danger mt-2 text-center">
                  {codeError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
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