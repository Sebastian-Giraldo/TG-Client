import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

// 1) Creamos el contexto que contendrá la información de autenticación\ nconst UserContext = createContext();
const UserContext = createContext();

// 2) Hook personalizado para acceder al contexto de usuario desde cualquier componente
export const useUser = () => {
  const context = useContext(UserContext);
  // Si el contexto no está dentro de un UserProvider, lanzamos un error
  if (context === undefined) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context; // Devuelve { user, setUser, logout }
};

/**
 * 3) UserProvider:
 * - Envuelve toda la aplicación para proporcionar el estado de usuario.
 * - Maneja la suscripción a Firebase Auth y control de inactividad.
 */
export function UserProvider({ children }) {
  // Estado para almacenar el usuario autenticado (objeto Firebase User o null)
  const [user, setUser] = useState(null);
  // Indicador para saber si estamos pendientes de la respuesta de Firebase
  const [initializing, setInitializing] = useState(true);

  /**
   * Función para cerrar sesión:
   * - Desconecta de Firebase Auth
   * - Limpia el usuario en el estado y localStorage
   * - Redirige al usuario a la página de landing
   */
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/landing";
  }, []);

  /**
   * Efecto: se ejecuta al montar el proveedor
   * - Se suscribe a onAuthStateChanged de Firebase
   * - Actualiza `user` y marca `initializing` como false cuando llega la info
   * - Retorna la función unsubscribe para limpiar el listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Efecto de auto-logout por inactividad:
   * - Solo se inicia una vez que `initializing` es false
   * - Reinicia un temporizador de 20 min en cada evento de actividad
   * - Al expirar, llama a `logout`
   */
  useEffect(() => {
    if (initializing) return; // Espera a que termine la inicialización

    let timerId;
    const TIMEOUT = 20 * 60 * 1000; // 20 minutos en milisegundos

    // Función para reiniciar el timer
    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        logout();
      }, TIMEOUT);
    };

    // Lista de eventos que consideramos actividad del usuario
    const events = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    // Inicializa el contador la primera vez
    resetTimer();

    // Cleanup: limpia timer y listeners al desmontar o cambiar
    return () => {
      if (timerId) clearTimeout(timerId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [initializing, logout]);

  // Si aún estamos inicializando, no renderizamos nada
  if (initializing) return null;

  // Proveemos `user`, `setUser` y `logout` a los componentes hijos
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
