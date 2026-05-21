import { useState, useEffect } from 'react';
import axios from 'axios';

function Inscripciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [clases, setClases] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [espacios, setEspacios] = useState([]);
  
  // 1. NUEVO ESTADO: Para guardar el listado de inscripciones de la base de datos
  const [inscripciones, setInscripciones] = useState([]);

  const [idAlumno, setIdAlumno] = useState('');
  const [idClase, setIdClase] = useState('');
  const [estado, setEstado] = useState('Activa');

  // Función para cargar las inscripciones desde la API
  const cargarInscripciones = () => {
    axios.get('https://localhost:7132/api/Inscripciones')
      .then(res => setInscripciones(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error al cargar inscripciones:", err));
  };

  useEffect(() => {
    // Cargamos los catálogos principales
    axios.get('https://localhost:7132/api/Alumnos')
      .then(res => setAlumnos(Array.isArray(res.data) ? res.data : []));

    axios.get('https://localhost:7132/api/Clases')
      .then(res => setClases(Array.isArray(res.data) ? res.data : []));

    axios.get('https://localhost:7132/api/Profesores')
      .then(res => setProfesores(Array.isArray(res.data) ? res.data : []));

    axios.get('https://localhost:7132/api/Espacios')
      .then(res => setEspacios(Array.isArray(res.data) ? res.data : []));

    // Cargamos la lista de inscripciones al arrancar
    cargarInscripciones();
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevaInscripcion = {
      idAlumno: parseInt(idAlumno),
      idClase: parseInt(idClase),
      estado: estado
    };

    axios.post('https://localhost:7132/api/Inscripciones', nuevaInscripcion)
      .then(response => {
        alert("¡Alumno inscripto a la clase correctamente!");
        setIdAlumno('');
        setIdClase('');
        // REFRESCAMOS LA TABLA: Para que aparezca la nueva fila al instante
        cargarInscripciones();
      })
      .catch(error => {
        console.error("Error al inscribir:", error);
        alert("Hubo un error al guardar la inscripción.");
      });
  };

  // FUNCIÓN EXTRA: Por si quieren dar de baja una inscripción desde la tabla
  const manejarEliminarInscripcion = (id) => {
    const confirmar = window.confirm("¿Querés eliminar esta inscripción de la base de datos?");
    if (confirmar) {
      axios.delete(`https://localhost:7132/api/Inscripciones/${id}`)
        .then(() => {
          cargarInscripciones(); // Volvemos a leer de la base
        })
        .catch(err => alert("No se pudo eliminar la inscripción."));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inscripciones</h2>

      {/* FORMULARIO DE ALTA */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-emerald-800 mb-4">Nueva Inscripción</h3>
        
        <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Alumno</label>
            <select 
              value={idAlumno}
              onChange={(e) => setIdAlumno(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>-- Elegir Alumno --</option>
              {alumnos.map(alumno => (
                <option key={alumno.idAlumno} value={alumno.idAlumno}>
                  {alumno.nombre} {alumno.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Clase</label>
            <select 
              value={idClase}
              onChange={(e) => setIdClase(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>-- Elegir Clase --</option>
              {clases.map(clase => {
                const profe = profesores.find(p => p.idProfesor === clase.idProfesor);
                const nombreProfe = profe ? profe.nombre : `Profe #${clase.idProfesor}`;
                const espacio = espacios.find(e => e.idEspacio === clase.idEspacio);
                const lugar = espacio ? espacio.nombreDireccion : `Lugar #${clase.idEspacio}`;

                return (
                  <option key={clase.idClase} value={clase.idClase}>
                    {clase.dias} - {clase.horario} hs | Prof. {nombreProfe} | {lugar}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Activa">Activa</option>
                <option value="En Pausa">En Pausa</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-1/2"
            >
              Confirmar Inscripción
            </button>
          </div>
        </form>
      </div>

      {/* TABLA DE VISUALIZACIÓN */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Alumnos Inscriptos Actualmente</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-emerald-700 text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">Alumno</th>
              <th className="px-6 py-4 font-semibold">Clase / Horario</th>
              <th className="px-6 py-4 font-semibold">Profesor</th>
              <th className="px-6 py-4 font-semibold">Lugar</th>
              <th className="px-6 py-4 font-semibold text-center">Estado</th>
              <th className="px-6 py-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.length > 0 ? (
              inscripciones.map((ins, index) => {
                // Buscamos los datos cruzados para armar la fila
                const alumno = alumnos.find(a => a.idAlumno === ins.idAlumno);
                const clase = clases.find(c => c.idClase === ins.idClase);
                
                const profe = clase ? profesores.find(p => p.idProfesor === clase.idProfesor) : null;
                const espacio = clase ? espacios.find(e => e.idEspacio === clase.idEspacio) : null;

                return (
                  <tr key={index} className="border-b border-gray-200 hover:bg-emerald-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {alumno ? `${alumno.nombre} ${alumno.apellido}` : `Alumno #${ins.idAlumno}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {clase ? `${clase.dias} - ${clase.horario} hs` : '---'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {profe ? profe.nombre : '---'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {espacio ? espacio.nombreDireccion : '---'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ins.estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ins.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => manejarEliminarInscripcion(ins.idInscripcion)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold hover:bg-red-200 transition-colors text-xs"
                      >
                        Dar de Baja
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
                  No hay inscripciones registradas en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inscripciones;