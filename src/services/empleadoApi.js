const API_URL = 'http://localhost:5066/api/Empleado'; // <-- ¡Ya tienes el puerto correcto!

// --- FUNCIONES DE TRADUCCIÓN ---
const apiToApp = (empleadoApi) => {
  if (!empleadoApi) return null;
  return {
    idEmpleado: empleadoApi.IDEMPLEADO,
    nombreCompleto: empleadoApi.NOMBRECOMPLETO,
    correo: empleadoApi.CORREO,
    sueldo: empleadoApi.SUELDO,
    fechaContrato: empleadoApi.FECHACONTRATO,
    estatus: empleadoApi.ESTATUS,
  };
};

const appToApi = (empleadoApp) => {
  return {
    IDEMPLEADO: empleadoApp.idEmpleado || 0, // Incluimos el ID
    NOMBRECOMPLETO: empleadoApp.nombreCompleto,
    CORREO: empleadoApp.correo,
    SUELDO: empleadoApp.sueldo,
    FECHACONTRATO: empleadoApp.fechaContrato,
    ESTATUS: empleadoApp.estatus,
  };
};

// --- SERVICIOS API (CORREGIDOS) ---

export const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los empleados');
  }
  const dataApi = await response.json();
  return dataApi.map(apiToApp);
};

export const createEmpleado = async (empleadoApp) => {
  const empleadoApi = appToApi(empleadoApp);

  // CORRECCIÓN: Tu backend espera POST para Crear
  const response = await fetch(API_URL, {
    method: 'POST', // <-- CORREGIDO (antes era PUT)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleadoApi),
  });
  if (!response.ok) {
    throw new Error('Error al crear el empleado');
  }
  const nuevoEmpleadoApi = await response.json(); 
  return apiToApp(nuevoEmpleadoApi);
};

export const updateEmpleado = async (idEmpleado, empleadoApp) => {
  // Tu backend espera el ID dentro del objeto, no en la URL
  const empleadoApi = appToApi({ ...empleadoApp, idEmpleado });

  // CORRECCIÓN: Tu backend espera PUT para Editar y sin ID en la URL
  const response = await fetch(API_URL, { // <-- CORREGIDO (URL base)
    method: 'PUT', // <-- CORREGIDO (antes era POST)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleadoApi),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el empleado');
  }
  return response.ok;
};

export const deleteEmpleado = async (idEmpleado) => {
  const response = await fetch(`${API_URL}/${idEmpleado}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el empleado');
  }
  return response.ok;
};