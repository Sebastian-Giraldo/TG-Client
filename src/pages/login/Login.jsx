import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage";
import ErrorBox from "../../components/ErrorBox";
import "./stylesLogin.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // 1) error de login
  const [error, setError] = useAutoDismissMessage(8000);

  // 2) reset password: error y success
  const [resetErrorMsg,   setResetErrorMsg]   = useAutoDismissMessage(8000);
  const [resetSuccessMsg, setResetSuccessMsg] = useAutoDismissMessage(8000);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setResetErrorMsg(null);
    setResetSuccessMsg(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      const userData = {
        uid:         cred.user.uid,
        name:        cred.user.displayName || "",
        email:       cred.user.email,
        photoURL:    cred.user.photoURL || "",
        accessToken: token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch {
      setError("Usuario y/o contraseña incorrectos");
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setResetErrorMsg(null);
    setResetSuccessMsg(null);

    if (!email) {
      setResetErrorMsg("Por favor ingresa tu correo para recuperar tu contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccessMsg(
        `✔️ Te hemos enviado un correo a ${email}. Revisa tu bandeja de entrada.`
      );
    } catch {
      setResetErrorMsg("❌ No se pudo enviar el correo de recuperación.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-primary">Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* Error de login */}
          <ErrorBox message={error} type="danger" />

          <button
            type="button"
            className="forgot-password"
            onClick={handleResetPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {/* Error al enviar reset */}
          <ErrorBox message={resetErrorMsg} type="danger" />

          {/* Éxito al enviar reset */}
          <ErrorBox message={resetSuccessMsg} type="success" />

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
