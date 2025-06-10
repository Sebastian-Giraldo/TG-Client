import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Ajusta la ruta si es diferente
import { useUser } from '../context/UserContext';

function LogoutButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('user'); 
      setUser(null); 
      navigate('/landing'); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline-dark">
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;