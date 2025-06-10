// hooks/useAutoDismissMessage.js
// Hook personalizado para mostrar un mensaje temporal que se autodescartará después de un tiempo
import { useState, useEffect } from "react";

/**
 * useAutoDismissMessage:
 *  - duration: tiempo en milisegundos antes de desaparecer (por defecto 8000 ms)
 *  - msg: estado que contiene el mensaje actual (string o null)
 *  - setMsg: función para actualizar el mensaje
 *
 * Devuelve: [msg, setMsg]
 *
 * Ejemplo de uso:
 *   const [error, setError] = useAutoDismissMessage(5000);
 *   setError("¡Ocurrió un error!");
 *   // error se limpiará automáticamente tras 5 segundos
 */
export function useAutoDismissMessage(duration = 8000) {
  // Estado local para almacenar el mensaje actual o null
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // Si no hay mensaje, no arrancamos timer
    if (!msg) return;

    // Creamos un temporizador que limpia el mensaje tras 'duration' ms
    const timer = setTimeout(() => {
      setMsg(null);
    }, duration);

    // Limpieza: si msg cambia o se desmonta, borramos el timer
    return () => clearTimeout(timer);
  }, [msg, duration]); // Se vuelve a ejecutar cuando cambian msg o duration

  // Retornamos el estado y la función para actualizarlo
  return [msg, setMsg];
}