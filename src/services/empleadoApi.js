
const API_URL = 'http://localhost:5004/api/Empleado';

export const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los empleados');
  }
    return await response.json();
};


export const createEmpleado = async (empleado) => {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(empleado),
  });
  if (!response.ok) {
    throw new Error('Error al crear el empleado');
  }
  return await response.json();
};

export const updateEmpleado = async (empleado, empleadoData) => {
    const response = await fetch(`${API_URL}/${empleado.idEmpleado}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(empleadoData),
  });
    if (!response.ok) {
        throw new Error('Error al actualizar el empleado');
    }
    return await response.ok();
};

//deleteEmpleado
export const deleteEmpleado = async (idEmpleado) => {
  const response = await fetch(`${API_URL}/${idEmpleado}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el empleado');
  }
  return await response.ok();
};