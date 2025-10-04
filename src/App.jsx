import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { DATOS_INICIALES_EMPLEADOS } from './Datos.jsx'

function Header({ title }) {
  return (
    <header className="text-center mb-4">
      <h1>{title}</h1>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
    </header>
  );
}



function App() {

  const [empleados, setEmpleados] = useState(DATOS_INICIALES_EMPLEADOS);
  const [nombre, setNombre] = useState('');
  const [salario, setSalario] = useState('');

  const Ingresar = (event) => {
    event.preventDefault();


    const nuevoEmpleado = {
      id: Date.now,
      nombre: nombre,
      salario: salario,
    };

    setEmpleados([...empleados, nuevoEmpleado]);
    setNombre('');
    setSalario('');
  };

  const Eliminar = (id) => {
    const empleadosActualizados = empleados.filter(empleado => empleado.id !== id);
    setEmpleados(empleadosActualizados);
  };

  
  return (
    <div className="container mt-5">
      {/* funcion innecesaria para uso de parametros  */}

      <Header title="CRUD de Empleados" />
      <form onSubmit={Ingresar} className="mb-4">
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Nombre del empleado" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="number" className="form-control" placeholder="Salario" value={salario} onChange={(e) => setSalario(e.target.value)} />
          <button className="btn btn-primary" type="submit">Agregar Empleado</button>
        </div>
      </form>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Salario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>{empleado.nombre}</td>
              <td>${empleado.salario}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => Eliminar(empleado.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

    </div>

  )
}

export default App
