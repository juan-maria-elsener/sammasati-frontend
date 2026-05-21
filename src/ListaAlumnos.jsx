import { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioAlumno from './FormularioAlumno';

function ListaAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  
  // 1. NUEVO ESTADO: Lo que el usuario escribe en el buscador
  const [busqueda, setBusqueda] = useState('');

  const cargarAlumnos = () => {
    axios.get('https://localhost:7132/api/Alumnos')
      .then(response => setAlumnos(Array.isArray(response.data) ? response.data : []))
      .catch(error => console.error("Error al conectar:", error));
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const manejarBorrar = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés borrar a este alumno de Sammasati?");
    if (confirmar) {
      axios.delete(`https://localhost:7132/api/Alumnos/${id}`)
        .then(response => cargarAlumnos())
        .catch(error => alert("No se pudo borrar el registro."));
    }
  };

  // 2. LÓGICA DE FILTRO: Creamos una lista dinámica en tiempo real
  const alumnosFiltrados = alumnos.filter((alumno) => {
    const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Listado de Alumnos - Sammasati</h2>
      
      <FormularioAlumno 
        onAlumnoAgregado={cargarAlumnos} 
        alumnoEnEdicion={alumnoSeleccionado}
        cancelarEdicion={() => setAlumnoSeleccionado(null)}
      />

      {/* 3. INPUT VISUAL: La barra de búsqueda con diseño de Tailwind */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
        
        {/* Un pequeño contador para saber cuántos resultados hay */}
        <div className="text-sm font-medium px-4 py-2 bg-emerald-50 text-emerald-800 rounded-md w-full md:w-auto text-center border border-emerald-100">
          Total: {alumnosFiltrados.length} alumno(s)
        </div>
      </div>
      
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
            {/* 4. CAMBIO CLAVE: Dibujamos alumnosFiltrados en vez de alumnos */}
            {alumnosFiltrados.length > 0 ? (
              alumnosFiltrados.map((alumno, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-emerald-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</td>
                  <td className="px-6 py-4 text-gray-600">{alumno.telefono || '---'}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setAlumnoSeleccionado(alumno)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-200 transition-colors mr-2"
                    >
                      Editar
                    </button>
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
                  {/* Mensaje dinámico si buscaste algo que no existe */}
                  {busqueda ? 'No se encontraron alumnos con esa búsqueda...' : 'Cargando alumnos o no hay registros...'}
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