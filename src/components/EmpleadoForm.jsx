import { useState, useContext, useEffect } from 'react';
import { EmpleadoContext } from '../context/EmpleadoContext';
import * as empleadoApi from '../services/empleadoApi';

// Estado inicial vacío, coincidiendo con la DB
const formInicial = {
  NombreCompleto: '',
  Correo: '',
  Sueldo: '',
  FechaContrato: '',
  Estatus: 'A', // Por defecto es 'Activo'
};

// Recibe props de HomePage
function EmpleadoForm({ empleadoAEditar, setEmpleadoAEditar }) {
  const { dispatch } = useContext(EmpleadoContext);
  const [form, setForm] = useState(formInicial);
  const [errores, setErrores] = useState({}); // Estado para la validación

  // ¡Otro useEffect!
  // Este se ejecuta CADA VEZ que 'empleadoAEditar' cambia
  useEffect(() => {
    if (empleadoAEditar) {
      // Si hay un empleado para editar, llenamos el formulario
      
      // Tu SP devuelve la fecha como DD/MM/YYYY.
      // El input <input type="date"> necesita YYYY-MM-DD.
      // Debemos convertirla.
      const fechaParts = empleadoAEditar.fechaContrato.split('/');
      const fechaISO = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

      setForm({
        ...empleadoAEditar,
        Sueldo: empleadoAEditar.sueldo,
        FechaContrato: fechaISO, // Usamos la fecha convertida
      });
    } else {
      // Si no, reseteamos el formulario
      setForm(formInicial);
    }
  }, [empleadoAEditar]); // Depende de 'empleadoAEditar'

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ¡Requisito: Formulario con Validación!
  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!form.NombreCompleto.trim()) {
      nuevosErrores.NombreCompleto = 'El nombre es obligatorio.';
    }
    if (!form.Correo.trim()) {
      nuevosErrores.Correo = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(form.Correo)) { // Regex simple de email
      nuevosErrores.Correo = 'El formato del correo no es válido.';
    }
    if (!form.Sueldo || form.Sueldo <= 0) {
      nuevosErrores.Sueldo = 'El sueldo debe ser un número positivo.';
    }
    if (!form.FechaContrato) {
      nuevosErrores.FechaContrato = 'La fecha es obligatoria.';
    }
    setErrores(nuevosErrores);
    // Retorna 'true' si el objeto de errores está vacío
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validar
    if (!validarFormulario()) {
      return; // Detiene el envío si hay errores
    }
    
    // Tu SP espera la fecha en formato DD/MM/YYYY
    // Debemos convertirla de YYYY-MM-DD (del input)
    const fechaParts = form.FechaContrato.split('-');
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    
    // Preparamos los datos a enviar
    const dataAEnviar = {
      ...form,
      FechaContrato: fechaFormateada,
      // Convertimos sueldo a número por si acaso
      Sueldo: parseFloat(form.Sueldo) 
    };

    try {
      // 2. Comprobar si es Edición o Creación
      if (empleadoAEditar) {
        // --- LÓGICA DE MODIFICAR (POST) ---
        await empleadoApi.updateEmpleado(empleadoAEditar.idEmpleado, dataAEnviar);
        dispatch({ type: 'UPDATE_EMPLEADO', payload: dataAEnviar });
        alert('Empleado modificado con éxito.');

      } else {
        // --- LÓGICA DE AGREGAR (PUT) ---
        const nuevoEmpleado = await empleadoApi.createEmpleado(dataAEnviar);
        // Despachamos el nuevo empleado que nos devolvió la API
        dispatch({ type: 'ADD_EMPLEADO', payload: nuevoEmpleado }); 
        alert('Empleado agregado con éxito.');
      }
      
      // 3. Limpiar todo
      handleReset();

    } catch (error) {
      console.error(error.message);
      alert('Ocurrió un error al guardar.');
    }
  };

  // Limpia el formulario y quita el modo edición
  const handleReset = () => {
    setForm(formInicial);
    setEmpleadoAEditar(null);
    setErrores({});
  };

  return (
    // Usamos 'onSubmit' para el <form>
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5 className="mb-3">
        {empleadoAEditar ? 'Editando Empleado' : 'Agregar Nuevo Empleado'}
      </h5>
      
      <div className="row g-3">
        {/* Nombre Completo */}
        <div className="col-md-6">
          <label htmlFor="NombreCompleto" className="form-label">Nombre Completo</label>
          <input
            type="text"
            // Bootstrap: 'is-invalid' muestra el error
            className={`form-control ${errores.NombreCompleto ? 'is-invalid' : ''}`}
            id="NombreCompleto"
            name="NombreCompleto"
            value={form.NombreCompleto}
            onChange={handleChange}
          />
          {/* Mensaje de error de Bootstrap */}
          {errores.NombreCompleto && (
            <div className="invalid-feedback">{errores.NombreCompleto}</div>
          )}
        </div>
        
        {/* Correo */}
        <div className="col-md-6">
          <label htmlFor="Correo" className="form-label">Correo</label>
          <input
            type="email"
            className={`form-control ${errores.Correo ? 'is-invalid' : ''}`}
            id="Correo"
            name="Correo"
            value={form.Correo}
            onChange={handleChange}
          />
          {errores.Correo && (
            <div className="invalid-feedback">{errores.Correo}</div>
          )}
        </div>

        {/* Sueldo */}
        <div className="col-md-4">
          <label htmlFor="Sueldo" className="form-label">Sueldo</label>
          <input
            type="number"
            className={`form-control ${errores.Sueldo ? 'is-invalid' : ''}`}
            id="Sueldo"
            name="Sueldo"
            value={form.Sueldo}
            onChange={handleChange}
          />
          {errores.Sueldo && (
            <div className="invalid-feedback">{errores.Sueldo}</div>
          )}
        </div>

        {/* Fecha Contrato */}
        <div className="col-md-4">
          <label htmlFor="FechaContrato" className="form-label">Fecha Contrato</label>
          <input
            type="date" // Input de calendario
            className={`form-control ${errores.FechaContrato ? 'is-invalid' : ''}`}
            id="FechaContrato"
            name="FechaContrato"
            value={form.FechaContrato}
            onChange={handleChange}
          />
          {errores.FechaContrato && (
            <div className="invalid-feedback">{errores.FechaContrato}</div>
          )}
        </div>

        {/* Estatus */}
        <div className="col-md-4">
          <label htmlFor="Estatus" className="form-label">Estatus</label>
          <select 
            className="form-select" 
            id="Estatus"
            name="Estatus"
            value={form.Estatus}
            onChange={handleChange}
          >
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-3">
        <button className="btn btn-primary" type="submit">
          {empleadoAEditar ? 'Guardar Cambios' : 'Agregar Empleado'}
        </button>
        {/* El 'type="button"' es importante para que no envíe el form */}
        <button 
          className="btn btn-secondary ms-2" 
          type="button"
          onClick={handleReset}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EmpleadoForm;