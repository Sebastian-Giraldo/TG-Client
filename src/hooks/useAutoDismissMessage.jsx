// hooks/useAutoDismissMessage.js
import { useState, useEffect } from "react";

export function useAutoDismissMessage(duration = 8000) {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!msg) return;
    const timer = setTimeout(() => setMsg(null), duration);
    return () => clearTimeout(timer);
  }, [msg, duration]);

  return [msg, setMsg];
}
