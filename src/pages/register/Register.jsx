// src/pages/register/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import ModalVerifyCode from "../../components/ModalVerifyCode";
import { useAutoDismissMessage } from "../../hooks/useAutoDismissMessage";
import ErrorBox from "../../components/ErrorBox";
import "./stylesRegister.css";

export default function Register() {
  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  // errores autodescartables
  const [error,     setError]  = useAutoDismissMessage(8000);
  const [codeError, setCError] = useAutoDismissMessage(8000);

  // pasos: "form" o "verify"
  const [step, setStep]    = useState("form");
  const [inputCode, setCode] = useState("");

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    if (email.split("@")[1] !== "correounivalle.edu.co") {
      return setError("Solo se permiten correos de la Universidad del Valle.");
    }
    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }
    if (!PASSWORD_REGEX.test(password)) {
      return setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial."
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const res = await fetch(`${API}/verify-email/send-code`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code }),
      });
      if (!res.ok) throw new Error();
      setStep("verify");
    } catch {
      setError("Error enviando el correo de verificación.");
    }
  }

  async function handleVerify() {
    setCError(null);
    try {
      const res = await fetch(`${API}/verify-email/check-code`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code: inputCode }),
      });
      const { valid } = await res.json();
      if (!valid) return setCError("Código incorrecto");

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
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch {
      setCError("Error durante la verificación.");
    }
  }

  return (
    <>
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

      <div className="register-container">
        <div className="register-card">
          <h2>Crear cuenta</h2>
          <form onSubmit={handleRegister}>
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
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {/* error general */}
            <ErrorBox message={error} type="danger" />

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
