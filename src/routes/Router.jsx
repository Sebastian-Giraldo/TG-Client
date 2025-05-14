import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Footer from "../components/Footer";
import { UserProvider } from "../context/UserContext"; // Importa el Provider
import Dashboar from "../pages/dashboard/Dashboard";
import Consultas from "../pages/consultas/Consultas";
import VerificarPerfil from "../pages/validar perfil/VerificarPerfil";
import ProfileHistory from './../pages/perfiles/ProfileHistory';


function RouterApp() {
    return (
        <UserProvider> 
            <BrowserRouter>
                <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboar />} />
                        <Route path="/consultas" element={<Consultas />} />
                        <Route path="/verificarPerfil" element={<VerificarPerfil/>} />
                        <Route path="/profileHistory" element={<ProfileHistory/>} />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default RouterApp;
