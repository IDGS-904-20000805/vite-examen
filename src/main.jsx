import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
// 1. Importamos nuestro vigilante
import { ProtectedRoute } from './components/ProtectedRoute.jsx'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      
      // 2. RUTAS PROTEGIDAS
      // Creamos una "ruta de diseño" que usa ProtectedRoute
      {
        element: <ProtectedRoute />,
        children: [
          // Todas las rutas aquí dentro estarán protegidas
          {
            index: true, // La ruta raíz ("/")
            element: <HomePage />,
          },
          // Si tuvieras más rutas protegidas, irían aquí
          // { path: 'dashboard', element: <DashboardPage /> }
        ],
      },

      // 3. RUTAS PÚBLICAS
      {
        path: 'login',
        element: <LoginPage />,
      },

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);