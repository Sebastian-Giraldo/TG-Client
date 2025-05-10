import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./stylesRegister.css";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
  
    const emailDomain = email.split("@")[1];
    if (emailDomain !== "correounivalle.edu.co") {
      setError(
        "Solo se permiten correos institucionales de la Universidad del Valle"
      );
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
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
  
      setUser(userData); // Guardas en el contexto
      localStorage.setItem('user', JSON.stringify(userData)); // Guardas en el navegador
      navigate("/dashboard");
    } catch (err) {
      if(err.message === 'Firebase: Error (auth/email-already-in-use).'){
        return setError("El usuario ya se encuentra en uso"); 
      }
      if(err.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).'){
        return setError("Error en la contraseña, deben ser al menos 6 caracteres"); 
      }
      
    }
  };
  

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="text-primary">Crear cuenta</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Correo institucional"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Contraseña"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          {/* Botones centrados */}
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
