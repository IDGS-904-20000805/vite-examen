import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    // 1. useEffect PARA LEER localStorage AL CARGAR
    // Este se ejecuta solo una vez, cuando la app se carga por primera vez.
    useEffect(() => {
        // Revisa si ya hay una sesión guardada en localStorage
        const storedSession = localStorage.getItem('session');

        if (storedSession) {
            // Si la hay, la cargamos en el estado de React
            const sessionData = JSON.parse(storedSession);
            setUser(sessionData);
            setIsLoggedIn(true);
        }
    }, []); // El array vacío [] asegura que solo se ejecute al inicio

    const login = (userData) => {

        localStorage.setItem('session', JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('session');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};