import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Simulación de una llamada a API de Login
// En un caso real, esto estaría en 'src/services/authApi.js'
const simularLoginAPI = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                // Si es exitoso, devolvemos los datos del "usuario"
                resolve({ id: 1, username: 'admin', nombre: 'Administrador' });
            } else {
                reject(new Error('Credenciales incorrectas. (Prueba: admin/admin123)'));
            }
        }, 500); // Simulamos 0.5s de espera
    });
};


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Redirección si ya está logueado
    // Si el usuario ya tiene sesión (en localStorage) y trata de ir a /login,
    // lo mandamos de vuelta al inicio.
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // 2. Manejador del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 3. Llamamos a nuestra API (simulada)
            const userData = await simularLoginAPI(username, password);

            // 4. Si la API responde OK, llamamos al 'login' del Context
            login(userData);

            // 5. Navegamos al inicio
            navigate('/', { replace: true });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title text-center">Iniciar Sesión</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Usuario</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Mostrar errores de login */}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;