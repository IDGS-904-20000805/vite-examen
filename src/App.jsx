import { Outlet, Link } from 'react-router-dom';
import { EmpleadoProvider } from './context/EmpleadoProvider';
import { AuthProvider } from './context/AuthProvider'; // 1. Importar
import { AuthContext } from './context/AuthContext'; // 1. Importar
import { useContext } from 'react'; // 1. Importar
function Header({ title }) {

  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header className="text-center mb-4">
      <h1>{title}</h1>
      <nav>
        {/* 4. Mostramos el botón de Logout solo si está logueado */}
        {isLoggedIn && (
          <button className="btn btn-link" onClick={logout}>
            Cerrar Sesión (Logout)
          </button>
        )}
      </nav>
    </header>
  );
}

function App() {
  // 2. ¡Toda la lógica de useState se fue!
  return (

    <AuthProvider>
      <EmpleadoProvider>
        <div className="container mt-5">
          {/* El Header ahora necesita estar DENTRO de AuthProvider */}
          <Header title="CRUD de Empleados con API" />
          <Outlet />
        </div>
      </EmpleadoProvider>
    </AuthProvider>
  );

}

export default App