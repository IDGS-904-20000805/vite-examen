import { useContext } from 'react';
import { EmpleadoContext } from '../context/EmpleadoContext';
import * as empleadoApi from '../services/empleadoApi';

// Recibe 'empleados' y 'setEmpleadoAEditar' como props desde HomePage
function EmpleadoList({ empleados, setEmpleadoAEditar }) {
    const { dispatch } = useContext(EmpleadoContext);

    const handleEliminar = async (id) => {
        // Pedimos confirmación
        if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            try {
                await empleadoApi.deleteEmpleado(id);
                // Si la API tuvo éxito, despachamos la acción al reducer
                dispatch({ type: 'DELETE_EMPLEADO', payload: id });
            } catch (error) {
                console.error(error.message);
                alert('No se pudo eliminar el empleado.');
            }
        }
    };

    const handleEditar = (empleado) => {
        // Le pasamos el empleado completo a HomePage
        setEmpleadoAEditar(empleado);
    };

    return (
        <table className="table table-striped table-hover">
            <thead className="table-dark">
                <tr>
                    {/* Actualizamos las columnas según tu Base de Datos */}
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
                {empleados.map((emp) => (
                    // Usamos 'idEmpleado' como viene de tu API/DB
                    <tr key={emp.idEmpleado}>
                        <td>{emp.idEmpleado}</td>
                        <td>{emp.nombreCompleto}</td>
                        <td>{emp.correo}</td>
                        <td>${emp.sueldo}</td>
                        <td>{emp.fechaContrato}</td> {/* Tu SP ya la formatea DD/MM/YYYY */}
                        <td>{emp.estatus}</td>
                        <td>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEditar(emp)} // Botón Editar
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEliminar(emp.idEmpleado)} // Botón Eliminar
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