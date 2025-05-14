import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import "./stylesLogin.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const token = await newUser.getIdToken();
      const userData = {
        uid: newUser.uid,
        name: newUser.displayName || "",
        email: newUser.email,
        photoURL: newUser.photoURL || "",
        accessToken: token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (err) {
      setError(
        "Error en el inicio de sesión<br> Usuario y/o contraseña incorrectos"
      );
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setResetMsg("");
    if (!email) {
      setResetMsg("Por favor ingresa tu correo para recuperar tu contraseña.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg(
        `✔️ Te hemos enviado un correo a ${email}. Revisa tu bandeja de entrada.`
      );
    } catch (err) {
      console.error(err);
      setResetMsg("❌ No se pudo enviar el correo de recuperación.");
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p
              className="error"
              dangerouslySetInnerHTML={{ __html: error }}
            />
          )}

          <button
            type="button"
            className="forgot-password"
            onClick={handleResetPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {resetMsg && (
            <p
              className={`reset-message ${
                resetMsg.startsWith("✔️") ? "success" : "error"
              }`}
            >
              {resetMsg}
            </p>
          )}

          <div className="login-buttons" style={{ display: "flex", gap: "1rem" }}>
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
