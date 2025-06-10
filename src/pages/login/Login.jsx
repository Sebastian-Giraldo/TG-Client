import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";                        // Funciones de Firebase Auth
import { useNavigate } from "react-router-dom";  // Hook para navegación
import { useUser } from "../../context/UserContext"; // Contexto de usuario global
import { auth } from "../../firebase/firebase";    // Configuración de Firebase Auth
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage"; // Hook para mensajes que se ocultan solos
import ErrorBox from "../../components/ErrorBox";   // Componente para mostrar alertas
import "./stylesLogin.css";                         // Estilos específicos de la página de login

/**
 * Componente Login:
 * - Permite iniciar sesión con correo y contraseña
 * - Maneja errores de autenticación y recupera contraseña
 */
function Login() {
  const navigate = useNavigate();   // Hook de React Router para redirigir
  const { setUser } = useUser();    // Función para actualizar el estado global de usuario

  // Estados locales para inputs de correo y contraseña
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // 1) Estado y setter para error de login (se oculta tras 8 s)
  const [error, setError] = useAutoDismissMessage(8000);

  // 2) Estados y setters para mensajes de reset (error y éxito)
  const [resetErrorMsg,   setResetErrorMsg]   = useAutoDismissMessage(8000);
  const [resetSuccessMsg, setResetSuccessMsg] = useAutoDismissMessage(8000);

  /**
   * handleLogin:
   * - Evita el comportamiento por defecto del form
   * - Limpia mensajes previos
   * - Intenta autenticar usando Firebase Auth
   * - En caso de éxito, guarda datos del usuario y redirige
   * - En caso de error, muestra alerta
   */
  const handleLogin = async (e) => {
    e.preventDefault();           // Previene recarga de la página
    setError(null);               // Limpia mensaje de error
    setResetErrorMsg(null);       // Limpia posibles mensajes de reset
    setResetSuccessMsg(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken(); // Obtiene el token de Firebase

      // Prepara objeto con datos relevantes del usuario
      const userData = {
        uid:         cred.user.uid,
        name:        cred.user.displayName || "",
        email:       cred.user.email,
        photoURL:    cred.user.photoURL || "",
        accessToken: token,
      };

      setUser(userData);                                       // Actualiza contexto global
      localStorage.setItem("user", JSON.stringify(userData)); // Almacena en localStorage
      navigate("/dashboard");                                // Redirige al dashboard
    } catch {
      // Muestra mensaje genérico de credenciales incorrectas
      setError("Usuario y/o contraseña incorrectos");
    }
  };

  /**
   * handleResetPassword:
   * - Limpia errores previos
   * - Verifica que exista un correo
   * - Solicita envío de email de recuperación
   * - Muestra mensajes de éxito o error
   */
  const handleResetPassword = async () => {
    setError(null);
    setResetErrorMsg(null);
    setResetSuccessMsg(null);

    if (!email) {
      // Si no hay correo ingresado, muestra mensaje de advertencia
      setResetErrorMsg("Por favor ingresa tu correo para recuperar tu contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email); // Envía email de reset
      setResetSuccessMsg(
        `✔️ Te hemos enviado un correo a ${email}. Revisa tu bandeja de entrada.`
      );
    } catch {
      // En caso de fallo, muestra alerta de error
      setResetErrorMsg("❌ No se pudo enviar el correo de recuperación.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-primary">Iniciar sesión</h2>

        {/* Formulario de login */}
        <form onSubmit={handleLogin}>
          {/* Campo de email */}
          <input
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {/* Campo de contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* Muestra error de login (rojo) */}
          <ErrorBox message={error} type="danger" />

          {/* Botón para solicitar restablecer contraseña */}
          <button
            type="button"
            className="forgot-password"
            onClick={handleResetPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {/* Muestra error de reset (rojo) */}
          <ErrorBox message={resetErrorMsg} type="danger" />

          {/* Muestra éxito de reset (verde) */}
          <ErrorBox message={resetSuccessMsg} type="success" />

          {/* Botones de submit y registro */}
          <div className="login-buttons">
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
