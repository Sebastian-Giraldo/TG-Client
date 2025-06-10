import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

// 1. Crea el contexto
const UserContext = createContext();

// 2. Hook para consumirlo
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
};

// 3. Provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // logout original
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    // redirige al landing:
    window.location.href = "/landing";
  }, []);

  // escucha de auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  //  ➡ Aquí añadimos el auto-logout por inactividad
  useEffect(() => {
    if (initializing) return;  // no arrancar hasta saber el user

    let timerId;
    const TIMEOUT = 20 * 60 * 1000; // 20 minutos

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        logout();
      }, TIMEOUT);
    };

    // Eventos que consideramos “actividad”
    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    // Arranca el primer conteo
    resetTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [initializing, logout]);

  if (initializing) return null;

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
