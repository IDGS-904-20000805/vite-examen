import { useState, useContext, useEffect } from 'react';
import { EmpleadoContext } from '../context/EmpleadoContext';
import * as empleadoApi from '../services/empleadoApi';

// Estado inicial en camelCase
const formInicial = {
  nombreCompleto: '',
  correo: '',
  sueldo: '',
  fechaContrato: '',
  estatus: 'A',
};

function EmpleadoForm({ empleadoAEditar, setEmpleadoAEditar }) {
  const { dispatch } = useContext(EmpleadoContext);
  const [form, setForm] = useState(formInicial);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (empleadoAEditar) {
      // empleadoAEditar ahora viene en camelCase gracias al traductor
      const fechaParts = empleadoAEditar.fechaContrato.split('/');
      const fechaISO = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

      setForm({
        ...empleadoAEditar,
        fechaContrato: fechaISO, // Asignamos la fecha formateada
      });
    } else {
      setForm(formInicial);
    }
  }, [empleadoAEditar]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!form.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = 'El nombre es obligatorio.';
    }
    if (!form.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(form.correo)) {
      nuevosErrores.correo = 'El formato del correo no es válido.';
    }
    if (!form.sueldo || form.sueldo <= 0) {
      nuevosErrores.sueldo = 'El sueldo debe ser un número positivo.';
    }
    if (!form.fechaContrato) {
      nuevosErrores.fechaContrato = 'La fecha es obligatoria.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;
    
    // Formateamos la fecha para el SP (DD/MM/YYYY)
    const fechaParts = form.fechaContrato.split('-');
    const fechaFormateada = `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    
    const dataAEnviar = {
      ...form,
      fechaContrato: fechaFormateada,
      sueldo: parseFloat(form.sueldo) 
    };

    try {
      if (empleadoAEditar) {
        // --- LÓGICA DE MODIFICAR ---
        await empleadoApi.updateEmpleado(empleadoAEditar.idEmpleado, dataAEnviar);
        // Despachamos el payload con el ID para que el reducer lo encuentre
        dispatch({ 
          type: 'UPDATE_EMPLEADO', 
          payload: { ...dataAEnviar, idEmpleado: empleadoAEditar.idEmpleado } 
        });
        alert('Empleado modificado con éxito.');

      } else {
        // --- LÓGICA DE AGREGAR ---
        const nuevoEmpleado = await empleadoApi.createEmpleado(dataAEnviar);
        dispatch({ type: 'ADD_EMPLEADO', payload: nuevoEmpleado }); 
        alert('Empleado agregado con éxito.');
      }
      
      handleReset();

    } catch (error) {
      console.error(error.message);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleReset = () => {
    setForm(formInicial);
    setEmpleadoAEditar(null);
    setErrores({});
  };

  // --- ESTE ES EL JSX 100% CORREGIDO A camelCase ---
  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <h5 className="mb-3">
        {empleadoAEditar ? 'Editando Empleado' : 'Agregar Nuevo Empleado'}
      </h5>
      
      <div className="row g-3">
        {/* Nombre Completo */}
        <div className="col-md-6">
          <label htmlFor="nombreCompleto" className="form-label">Nombre Completo</label>
          <input
            type="text"
            className={`form-control ${errores.nombreCompleto ? 'is-invalid' : ''}`}
            id="nombreCompleto"
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
          />
          {errores.nombreCompleto && (
            <div className="invalid-feedback">{errores.nombreCompleto}</div>
          )}
        </div>
        
        {/* Correo */}
        <div className="col-md-6">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input
            type="email"
            className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
            id="correo"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />
          {errores.correo && (
            <div className="invalid-feedback">{errores.correo}</div>
          )}
        </div>

        {/* Sueldo */}
        <div className="col-md-4">
          <label htmlFor="sueldo" className="form-label">Sueldo</label>
          <input
            type="number"
            className={`form-control ${errores.sueldo ? 'is-invalid' : ''}`}
            id="sueldo"
            name="sueldo"
            value={form.sueldo}
            onChange={handleChange}
          />
          {errores.sueldo && (
            <div className="invalid-feedback">{errores.sueldo}</div>
          )}
        </div>

        {/* Fecha Contrato */}
        <div className="col-md-4">
          <label htmlFor="fechaContrato" className="form-label">Fecha Contrato</label>
          <input
            type="date"
            className={`form-control ${errores.fechaContrato ? 'is-invalid' : ''}`}
            id="fechaContrato"
            name="fechaContrato"
            value={form.fechaContrato}
            onChange={handleChange}
          />
          {errores.fechaContrato && (
            <div className="invalid-feedback">{errores.fechaContrato}</div>
          )}
        </div>

        {/* Estatus */}
        <div className="col-md-4">
          <label htmlFor="estatus" className="form-label">Estatus</label>
          <select 
            className="form-select" 
            id="estatus"
            name="estatus"
            value={form.estatus}
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