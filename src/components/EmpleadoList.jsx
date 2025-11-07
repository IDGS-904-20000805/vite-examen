import { useContext } from 'react';
import { EmpleadoContext } from '../context/EmpleadoContext';
import * as empleadoApi from '../services/empleadoApi';

function EmpleadoList({ empleados, setEmpleadoAEditar }) {
  const { dispatch } = useContext(EmpleadoContext);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await empleadoApi.deleteEmpleado(id);
        dispatch({ type: 'DELETE_EMPLEADO', payload: id });
      } catch (error) {
        console.error(error.message);
        alert('No se pudo eliminar el empleado.');
      }
    }
  };

  const handleEditar = (empleado) => {
    setEmpleadoAEditar(empleado);
  };

  return (
    <table className="table table-striped table-hover">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre Completo</th>
          <th>Correo</th>
          <th>Sueldo</th>
          <th>Fecha Contrato</th>
          <th>Estatus</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Esto ahora funcionará porque la API envía camelCase */}
        {empleados.map((emp) => (
          <tr key={emp.idEmpleado}>
            <td>{emp.idEmpleado}</td>
            <td>{emp.nombreCompleto}</td>
            <td>{emp.correo}</td>
            <td>${emp.sueldo}</td>
            <td>{emp.fechaContrato}</td>
            <td>{emp.estatus}</td>
            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEditar(emp)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleEliminar(emp.idEmpleado)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmpleadoList;