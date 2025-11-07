import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center">
      <h2>Error 404: Página No Encontrada</h2>
      <p>La ruta que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
    </div>
  );
}
export default NotFoundPage;