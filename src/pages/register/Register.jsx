import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import "./stylesRegister.css";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                 = useState("");

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // dominio institucional
    const domain = email.split("@")[1];
    if (domain !== "correounivalle.edu.co") {
      setError("Solo correos institucionales de la Universidad del Valle.");
      return;
    }

    // coincide password / confirm
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // fuerza mínima de seguridad
    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un caracter especial."
      );
      return;
    }

    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
      // códigos de error de Firebase
      if (err.code === "auth/email-already-in-use") {
        setError("El correo ya está en uso.");
      } else {
        setError("Error al registrar. Revisa la consola.");
        console.error(err);
      }
    }
  };

  return (
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
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-danger">{error}</p>}

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
  );
}

export default Register;
