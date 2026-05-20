import { useState } from 'react';
import axios from 'axios';

function FormularioAlumno({ onAlumnoAgregado }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState(''); // Agregamos el estado para el apellido
  const [telefono, setTelefono] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();

    // Le quitamos los espacios en blanco al teléfono para cumplir con tu Regex de C#
    const telefonoLimpio = telefono.replace(/\s+/g, '');

    // Armamos el paquete exactamente como lo pide tu backend
    const nuevoAlumno = { 
      nombre: nombre, 
      apellido: apellido,
      telefono: telefonoLimpio
    };

    axios.post('https://localhost:7132/api/Alumnos', nuevoAlumno)
      .then(response => {
        console.log("¡Alumno guardado con éxito!", response.data);
        // Limpiamos los 3 inputs
        setNombre('');
        setApellido('');
        setTelefono('');
        
        // Le avisamos a la tabla que recargue los datos
        if (onAlumnoAgregado) {
          onAlumnoAgregado();
        }
      })
      .catch(error => {
        console.error("Error al guardar el alumno:", error);
        alert("Hubo un error al guardar. Revisá la consola para más detalles.");
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <h3 className="text-xl font-bold text-emerald-800 mb-4">Agregar Nuevo Alumno</h3>
      
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

        {/* NUEVO INPUT: APELLIDO */}
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

        <button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default FormularioAlumno;