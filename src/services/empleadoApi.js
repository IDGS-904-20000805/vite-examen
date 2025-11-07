const API_URL = 'http://localhost:5066/api/Empleado';

// --- FUNCIONES DE TRADUCCIÓN ---
// Convierte de API (PascalCase) a App (camelCase)
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

// Convierte de App (camelCase) a API (PascalCase)
const appToApi = (empleadoApp) => {
  return {
    // No incluimos idEmpleado en el body, usualmente va en la URL o es 0
    NOMBRECOMPLETO: empleadoApp.nombreCompleto,
    CORREO: empleadoApp.correo,
    SUELDO: empleadoApp.sueldo,
    FECHACONTRATO: empleadoApp.fechaContrato,
    ESTATUS: empleadoApp.estatus,
  };
};

// --- SERVICIOS API (AHORA CON TRADUCCIÓN) ---

export const getEmpleados = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los empleados');
  }
  const dataApi = await response.json();
  // ¡Traducimos la respuesta a camelCase!
  return dataApi.map(apiToApp);
};

export const createEmpleado = async (empleadoApp) => {
  // 1. Traducimos de React (camel) a la API (Pascal)
  const empleadoApi = appToApi(empleadoApp);

  const response = await fetch(API_URL, {
    method: 'PUT', // Tu regla: PUT para crear
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleadoApi), // 2. Enviamos el objeto en PascalCase
  });
  if (!response.ok) {
    throw new Error('Error al crear el empleado');
  }
  const nuevoEmpleadoApi = await response.json();
  // 3. Traducimos la respuesta de la API a camelCase para React
  return apiToApp(nuevoEmpleadoApi);
};

export const updateEmpleado = async (idEmpleado, empleadoApp) => {
  // 1. Traducimos de React (camel) a la API (Pascal)
  const empleadoApi = appToApi(empleadoApp);
  
  // Agregamos el ID que espera el SP
  const dataAEnviar = {
    ...empleadoApi,
    IDEMPLEADO: idEmpleado 
  };

  const response = await fetch(`${API_URL}/${idEmpleado}`, {
    method: 'POST', // Tu regla: POST para modificar
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataAEnviar), // 2. Enviamos el objeto en PascalCase
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el empleado');
  }
  return response.ok; // El update no devuelve contenido
};

export const deleteEmpleado = async (idEmpleado) => {
  const response = await fetch(`${API_URL}/${idEmpleado}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el empleado');
  }
  return response.ok; // El delete no devuelve contenido
};