import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // 👈 Agrega Link
import { useUser } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import "./stylesLogin.css";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const token = await newUser.getIdToken();

      // 🔥 AQUÍ: guardas el usuario tanto en memoria como en localStorage
      const userData = {
        uid: newUser.uid,
        name: newUser.displayName || "",
        email: newUser.email,
        photoURL: newUser.photoURL || "",
        accessToken: token,
      };

      setUser(userData); // En memoria (contexto)
      localStorage.setItem("user", JSON.stringify(userData)); // En navegador

      navigate("/dashboard");
    } catch (err) {
      setError(
        "Error en el inicio de sesión<br> Usuario y/o contraseña incorrectos "
      );
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
          {/* {error && <p className="error">{error}</p>} */}
          {error && (
            <p
              className="error"
              dangerouslySetInnerHTML={{ __html: error }}
            ></p>
          )}

          <div className="login-buttons">
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>

            <Link to="/register" className="btn btn-outline-primary">
              Registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
