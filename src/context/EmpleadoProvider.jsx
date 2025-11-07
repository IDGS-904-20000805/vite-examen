import { useReducer } from 'react';
import { EmpleadoContext } from './EmpleadoContext';
import { empleadoReducer } from './EmpleadoReducer';

// Este es el estado inicial cuando la aplicación carga
const ESTADO_INICIAL = {
  empleados: [],
  loading: true, // Empezamos en 'cargando'
};

export const EmpleadoProvider = ({ children }) => {
  // 1. Usamos el Hook useReducer
  // Recibe el reducer (el cerebro) y el estado inicial
  // Devuelve el estado actual y la función 'dispatch'
  const [state, dispatch] = useReducer(empleadoReducer, ESTADO_INICIAL);

  // 'dispatch' es la función que usamos para enviar "acciones"
  // a nuestro reducer. Ej: dispatch({ type: 'ADD_EMPLEADO', ... })

  // 2. Retornamos el "Proveedor" del contexto
  return (
    <EmpleadoContext.Provider 
      value={{ 
        state,    // Pasamos el estado actual
        dispatch  // Pasamos la función para "despachar" acciones
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};