import { useState, useEffect } from 'react';
import axios from 'axios';

// Agregamos dos propiedades nuevas que va a recibir desde la tabla
function FormularioAlumno({ onAlumnoAgregado, alumnoEnEdicion, cancelarEdicion }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  // Magia de React: Si "alumnoEnEdicion" cambia, rellenamos los inputs automáticamente
  useEffect(() => {
    if (alumnoEnEdicion) {
      setNombre(alumnoEnEdicion.nombre);
      setApellido(alumnoEnEdicion.apellido);
      setTelefono(alumnoEnEdicion.telefono || '');
    } else {
      limpiarInputs();
    }
  }, [alumnoEnEdicion]);

  const limpiarInputs = () => {
    setNombre('');
    setApellido('');
    setTelefono('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const telefonoLimpio = telefono.replace(/\s+/g, '');

    if (alumnoEnEdicion) {
      // -----------------------------------------
      // MODO EDICIÓN: Actualizamos con PUT
      // -----------------------------------------
      const alumnoActualizado = { 
        idAlumno: alumnoEnEdicion.idAlumno, // C# necesita saber el ID para actualizar
        nombre: nombre, 
        apellido: apellido,
        telefono: telefonoLimpio
      };

      axios.put(`https://localhost:7132/api/Alumnos/${alumnoEnEdicion.idAlumno}`, alumnoActualizado)
        .then(response => {
          console.log("¡Alumno editado con éxito!");
          limpiarInputs();
          if (cancelarEdicion) cancelarEdicion(); // Avisamos que terminamos de editar
          if (onAlumnoAgregado) onAlumnoAgregado(); // Recargamos la tabla
        })
        .catch(error => {
          console.error("Error al editar:", error);
          alert("Hubo un error al actualizar el alumno.");
        });

    } else {
      // -----------------------------------------
      // MODO CREACIÓN: Guardamos con POST (Igual que antes)
      // -----------------------------------------
      const nuevoAlumno = { 
        nombre: nombre, 
        apellido: apellido,
        telefono: telefonoLimpio
      };

      axios.post('https://localhost:7132/api/Alumnos', nuevoAlumno)
        .then(response => {
          console.log("¡Alumno guardado con éxito!");
          limpiarInputs();
          if (onAlumnoAgregado) onAlumnoAgregado();
        })
        .catch(error => {
          console.error("Error al guardar:", error);
          alert("Hubo un error al crear el alumno.");
        });
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md border mb-8 transition-colors ${alumnoEnEdicion ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
      {/* Cambiamos el título dinámicamente */}
      <h3 className={`text-xl font-bold mb-4 ${alumnoEnEdicion ? 'text-blue-800' : 'text-emerald-800'}`}>
        {alumnoEnEdicion ? 'Editando Alumno' : 'Agregar Nuevo Alumno'}
      </h3>
      
      <form onSubmit={manejarEnvio} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input 
            type="text" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Juan"
            required
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input 
            type="text" 
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Pérez"
            required
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input 
            type="text" 
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: 3492123456"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button 
            type="submit" 
            className={`${alumnoEnEdicion ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto`}
          >
            {alumnoEnEdicion ? 'Actualizar' : 'Guardar'}
          </button>
          
          {/* Si estamos editando, mostramos un botón para cancelar y volver a modo creación */}
          {alumnoEnEdicion && (
            <button 
              type="button" 
              onClick={() => {
                limpiarInputs();
                if (cancelarEdicion) cancelarEdicion();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormularioAlumno;