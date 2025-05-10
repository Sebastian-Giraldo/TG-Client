import { createContext, useState, useContext } from 'react';

const userContext = createContext();

const useUser = () => {
    const context = useContext(userContext); // 🛠️ Ojo, aquí también debes usar useContext, no createContext otra vez.
    if (!context) {
        throw new Error('Error creando contexto');
    }
    return context;
};

function UserProvider({ children }) {
    const [user, setUser] = useState({
        uid: "", // ID de Firebase
        name: "",
        email: "",
        photoURL: "",
        accessToken: "",
    });

    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    );
}

// Exportar bien:
export { userContext, useUser, UserProvider };
