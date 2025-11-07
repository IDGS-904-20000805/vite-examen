// El reducer maneja CÓMO cambia el estado.
export const empleadoReducer = (state, action) => {
  // 'action' es un objeto, usualmente con 'type' (el comando)
  // y 'payload' (los datos)
  switch (action.type) {
    // Caso para cuando cargamos los empleados desde la API
    case 'SET_EMPLEADOS':
      return {
        ...state, // Copia el estado anterior
        empleados: action.payload, // Reemplaza los empleados
        loading: false, // Marcamos que ya terminamos de cargar
      };

    // Caso para agregar un empleado
    case 'ADD_EMPLEADO':
      return {
        ...state,
        // Agregamos el nuevo empleado (payload) a la lista existente
        empleados: [...state.empleados, action.payload],
      };

    // Caso para actualizar un empleado
    case 'UPDATE_EMPLEADO':
      return {
        ...state,
        empleados: state.empleados.map((emp) =>
          // Si el ID del empleado coincide con el ID de los datos (payload)...
          emp.idEmpleado === action.payload.idEmpleado 
            ? action.payload // ...reemplázalo con los nuevos datos
            : emp // ...si no, déjalo como estaba
        ),
      };

    // Caso para eliminar un empleado
    case 'DELETE_EMPLEADO':
      return {
        ...state,
        // Creamos una nueva lista filtrando al empleado
        // cuyo ID coincida con el payload (el ID a borrar)
        empleados: state.empleados.filter(
          (emp) => emp.idEmpleado !== action.payload
        ),
      };

    // Si no se reconoce la acción, devuelve el estado sin cambios
    default:
      return state;
  }
};