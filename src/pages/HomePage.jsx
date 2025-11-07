import { useContext, useEffect, useState } from 'react';
import { EmpleadoContext } from '../context/EmpleadoContext';
import EmpleadoForm from '../components/EmpleadoForm';
import EmpleadoList from '../components/EmpleadoList';
import * as empleadoApi from '../services/empleadoApi'; // Importamos la API

function HomePage() {

    const { state, dispatch } = useContext(EmpleadoContext);

  // 2. Creamos un estado local para saber qué empleado estamos editando
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  // 3. ¡Usamos useEffect!
  // Este Hook ejecuta código cuando el componente se "monta" (se dibuja)
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await empleadoApi.getEmpleados();
        // 4. Despachamos la acción para guardar los empleados en el estado global
        dispatch({ type: 'SET_EMPLEADOS', payload: data });
      } catch (error) {
        console.error(error.message);
      }
    };

    cargarEmpleados();
  }, [dispatch]); // El array vacío [] significa "ejecuta esto solo una vez"

  // 5. Mostramos un 'Cargando...' si los datos aún no llegan
  if (state.loading) {
    return <div className="text-center">Cargando empleados...</div>;
  }

  // 6. Renderizamos los componentes
  return (
    <div>
      {/* Pasamos el empleado a editar (o null) al formulario */}
      <EmpleadoForm 
        empleadoAEditar={empleadoAEditar}
        setEmpleadoAEditar={setEmpleadoAEditar} 
      />
      
      <hr />

      {/* Pasamos la lista de empleados y la función para editar */}
      <EmpleadoList 
        empleados={state.empleados}
        setEmpleadoAEditar={setEmpleadoAEditar} 
      />
    </div>
  );
}

export default HomePage;