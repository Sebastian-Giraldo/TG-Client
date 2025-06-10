// src/pages/register/Register.jsx
import React, { useState } from "react";                           // Importa React y useState para estados locales
import { createUserWithEmailAndPassword } from "firebase/auth";      // Función de Firebase Auth para crear usuarios
import { useNavigate, Link } from "react-router-dom";                // Hooks y componentes de React Router
import { useUser } from "../../context/UserContext";                // Contexto global de usuario
import { auth } from "../../firebase/firebase";                     // Configuración de Firebase Auth
import ModalVerifyCode from "../../components/ModalVerifyCode";    // Modal para ingresar código de verificación
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage"; // Hook para mensajes que se autodescartan
import ErrorBox from "../../components/ErrorBox";                    // Componente de alertas de error
import "./stylesRegister.css";                                      // Estilos de la página de registro

/**
 * Componente Register:
 * - Paso 1: formulario para solicitar un código de verificación
 * - Paso 2: modal para ingresar el código recibido
 * - Finalmente, crea el usuario en Firebase Auth
 */
export default function Register() {
  const API = process.env.REACT_APP_API_URL; // URL base del backend
  const navigate = useNavigate();            // Hook para redireccionar
  const { setUser } = useUser();             // Setter de usuario en contexto global

  // Estados para inputs de correo, contraseña y confirmación
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");

  // Estados para mostrar errores (autodescartables)
  const [error,     setError]  = useAutoDismissMessage(8000);
  const [codeError, setCError] = useAutoDismissMessage(8000);

  // Control de pasos: "form" o "verify"
  const [step, setStep]        = useState("form");
  const [inputCode, setCode]   = useState("");

  // Regex para validar fortaleza de la contraseña
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  /**
   * handleRegister:
   * - Valida correo institucional
   * - Verifica que las contraseñas coincidan y cumplan requisitos
   * - Genera un código de 6 dígitos y lo envía al backend
   */
  async function handleRegister(e) {
    e.preventDefault();         // Evita recarga de página
    setError(null);             // Limpia errores previos

    // 1) Dominio institucional
    if (email.split("@")[1] !== "correounivalle.edu.co") {
      return setError("Solo se permiten correos de la Universidad del Valle.");
    }
    // 2) Contraseñas coincidentes
    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }
    // 3) Fortaleza de la contraseña
    if (!PASSWORD_REGEX.test(password)) {
      return setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial."
      );
    }

    // Genera código aleatorio de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      // Envía el código al endpoint de verificación
      const res = await fetch(`${API}/verify-email/send-code`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error();
      // Cambia al paso de verificación
      setStep("verify");
    } catch {
      setError("Error enviando el correo de verificación.");
    }
  }

  /**
   * handleVerify:
   * - Envía el código ingresado al backend
   * - Si es válido, crea el usuario en Firebase Auth
   * - Actualiza contexto global y redirige al dashboard
   */
  async function handleVerify() {
    setCError(null);  // Limpia errores de código previo
    try {
      // Verifica el código con el backend
      const res = await fetch(`${API}/verify-email/check-code`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code: inputCode }),
      });
      const { valid } = await res.json();
      if (!valid) return setCError("Código incorrecto");

      // Crea el usuario en Firebase Auth
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await newUser.getIdToken();
      const userData = {
        uid:         newUser.uid,
        email:       newUser.email,
        accessToken: token,
      };
      setUser(userData);                                           // Actualiza contexto
      localStorage.setItem("user", JSON.stringify(userData));    // Guarda en localStorage
      navigate("/dashboard");                                    // Redirige al dashboard
    } catch {
      setCError("Error durante la verificación.");
    }
  }

  return (
    <>
      {/* Modal de verificación de código si corresponde */}
      {step === "verify" && (
        <ModalVerifyCode
          email={email}
          inputCode={inputCode}
          setInputCode={setCode}
          codeError={codeError}
          onVerify={handleVerify}
          onClose={() => setStep("form")}
        />
      )}

      {/* Formulario principal de registro */}
      <div className="register-container">
        <div className="register-card">
          <h2>Crear cuenta</h2>
          <form onSubmit={handleRegister}>
            {/* Input correo institucional */}
            <input
              type="email"
              placeholder="Correo institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Input contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Input confirmar contraseña */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {/* Error general de registro */}
            <ErrorBox message={error} type="danger" />

            {/* Botones de acción */}
            <div className="register-buttons">
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
              <Link to="/login" className="btn btn-outline-primary">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
