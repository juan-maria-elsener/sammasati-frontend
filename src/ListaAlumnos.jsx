import { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioAlumno from './FormularioAlumno';

function ListaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);

  const cargarAlumnos = () => {
    axios.get('https://localhost:7132/api/Alumnos')
      .then(response => {
        setAlumnos(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error al conectar:", error);
      });
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  // NUEVA FUNCIÓN: Para borrar un alumno
  const manejarBorrar = (id) => {
    // Agregamos una confirmación para que no borres a nadie por accidente si se te escapa el clic
    const confirmar = window.confirm("¿Estás seguro de que querés borrar a este alumno de Sammasati?");
    
    if (confirmar) {
      // Usamos comillas invertidas (backticks) para poder meter el ID en la URL
      axios.delete(`https://localhost:7132/api/Alumnos/${id}`)
        .then(response => {
          console.log("Alumno borrado exitosamente.");
          // Volvemos a cargar la tabla para que el alumno desaparezca de la vista
          cargarAlumnos();
        })
        .catch(error => {
          console.error("Error al borrar:", error);
          alert("No se pudo borrar. Si el alumno ya tiene inscripciones o cuotas registradas, el sistema te protege para no dejar datos huérfanos.");
        });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Listado de Alumnos - Sammasati</h2>
      
      <FormularioAlumno onAlumnoAgregado={cargarAlumnos} />
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-emerald-700 text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Teléfono</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length > 0 ? (
              alumnos.map((alumno, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-emerald-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</td>
                  <td className="px-6 py-4 text-gray-600">{alumno.telefono || '---'}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-200 transition-colors mr-2">
                      Editar
                    </button>
                    {/* NUEVO BOTÓN: Eliminar */}
                    {/* Le pasamos el idAlumno exactamente como viene de tu C# */}
                    <button 
                      onClick={() => manejarBorrar(alumno.idAlumno)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold hover:bg-red-200 transition-colors"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 font-medium">
                  Cargando alumnos o no hay registros en la base de datos...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaAlumnos;