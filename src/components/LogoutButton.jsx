import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Asegúrate de que la ruta sea correcta
import { useUser } from '../context/UserContext';

// Componente que renderiza un botón para cerrar sesión
function LogoutButton() {
  // Obtiene la función para actualizar el estado global del usuario
  const { setUser } = useUser();
  // Hook de react-router para navegar entre rutas
  const navigate = useNavigate();

  // Función que se ejecuta al hacer clic en el botón
  const handleLogout = async () => {
    try {
      // Desconecta la sesión en Firebase Auth
      await signOut(auth);
      // Elimina la información de usuario almacenada en localStorage
      localStorage.removeItem('user');
      // Actualiza el contexto de usuario a null (sin usuario)
      setUser(null);
      // Redirige al usuario a la página de aterrizaje
      navigate('/landing');
    } catch (error) {
      // Si ocurre un error, lo muestra en la consola
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    // Botón estilizado que dispara handleLogout al hacer clic
    <button onClick={handleLogout} className="btn btn-outline-dark">
      Cerrar sesión
    </button>
  );
}

export default LogoutButton; // Exporta el componente para usarlo en otras partes de la app
