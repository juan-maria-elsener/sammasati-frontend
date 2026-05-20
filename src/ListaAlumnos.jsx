import { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioAlumno from './FormularioAlumno';

function ListaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);

  // 1. Creamos una función que se encarga de ir a buscar los alumnos
  const cargarAlumnos = () => {
    axios.get('https://localhost:7132/api/Alumnos')
      .then(response => {
        setAlumnos(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error("Error al conectar:", error);
      });
  };

  // 2. El useEffect ahora solo llama a esa función la primera vez que carga la página
  useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Listado de Alumnos - Sammasati</h2>
      
      {/* 3. Acá le pasamos la función al formulario para que la use cuando termine de guardar */}
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
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-200 transition-colors">
                      Editar
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