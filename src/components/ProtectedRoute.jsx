import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Este componente es un "envoltorio"
export const ProtectedRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // 1. Revisa si el usuario está logueado
  if (!isLoggedIn) {
    // 2. Si NO lo está, lo redirige a /login
    // 'replace' evita que pueda "volver atrás" con el botón del navegador
    return <Navigate to="/login" replace />;
  }

  // 3. Si SÍ lo está, renderiza el contenido
  // <Outlet /> renderizará las rutas hijas que definamos en main.jsx
  return <Outlet />;
};