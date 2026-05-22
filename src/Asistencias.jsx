import { useState, useEffect } from 'react';
import axios from 'axios';

function Asistencias() {
  // 1. ESTADO PARA LAS PESTAÑAS
  const [pestañaActiva, setPestañaActiva] = useState('tomar'); // 'tomar' o 'historial'

  // 2. ESTADOS DE BASE DE DATOS
  const [clases, setClases] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [historialAsistencias, setHistorialAsistencias] = useState([]);

  // 3. ESTADOS PARA TOMAR ASISTENCIA
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [alumnosDeLaClase, setAlumnosDeLaClase] = useState([]);
  const [estadosAsistencia, setEstadosAsistencia] = useState({});
  const [fechaAsistencia, setFechaAsistencia] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T');
  });

  // 4. ESTADOS PARA VER HISTORIAL
  const [filtroAlumnoHistorial, setFiltroAlumnoHistorial] = useState('');

  // FUNCIÓN PARA TRAER TODOS LOS DATOS
  const cargarDatos = () => {
    Promise.all([
      axios.get('https://localhost:7132/api/Clases'),
      axios.get('https://localhost:7132/api/Inscripciones'),
      axios.get('https://localhost:7132/api/Alumnos'),
      axios.get('https://localhost:7132/api/Asistencias') // NUEVO: Traemos el historial
    ]).then(([resClases, resInsc, resAlumnos, resAsist]) => {
      setClases(resClases.data || []);
      setInscripciones(resInsc.data || []);
      setAlumnos(resAlumnos.data || []);
      // Invertimos el array para que las asistencias más nuevas salgan arriba
      setHistorialAsistencias((resAsist.data || []).reverse()); 
    }).catch(err => console.error("Error al cargar datos:", err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // LÓGICA: Filtrar alumnos cuando elijo una clase (Para la Pestaña 1)
  useEffect(() => {
    if (!claseSeleccionada) {
      setAlumnosDeLaClase([]);
      return;
    }
    const inscripcionesDeEstaClase = inscripciones.filter(i => i.idClase === parseInt(claseSeleccionada) && i.estado === 'Activa');
    const alumnosEncontrados = alumnos.filter(a => inscripcionesDeEstaClase.some(i => i.idAlumno === a.idAlumno));
    setAlumnosDeLaClase(alumnosEncontrados);

    const estadosIniciales = {};
    alumnosEncontrados.forEach(a => { estadosIniciales[a.idAlumno] = 'Presente'; });
    setEstadosAsistencia(estadosIniciales);
  }, [claseSeleccionada, inscripciones, alumnos]);

  const toggleAsistencia = (idAlumno) => {
    setEstadosAsistencia(prev => ({
      ...prev,
      [idAlumno]: prev[idAlumno] === 'Presente' ? 'Ausente' : 'Presente'
    }));
  };

  const guardarAsistencia = () => {
    if (alumnosDeLaClase.length === 0) return;

    const loteAsistencias = alumnosDeLaClase.map(a => ({
      idAlumno: a.idAlumno,
      idClase: parseInt(claseSeleccionada),
      fecha: fechaAsistencia,
      estado: estadosAsistencia[a.idAlumno]
    }));

    axios.post('https://localhost:7132/api/Asistencias/lote', loteAsistencias)
      .then(response => {
        alert("¡Asistencia guardada con éxito!");
        setClaseSeleccionada(''); // Resetea el formulario
        cargarDatos(); // Recarga la base de datos para que el historial se actualice al instante
      })
      .catch(error => {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar la asistencia.");
      });
  };

  // LÓGICA: Filtrar Historial (Para la Pestaña 2)
  const historialFiltrado = filtroAlumnoHistorial === '' 
    ? historialAsistencias 
    : historialAsistencias.filter(h => h.idAlumno === parseInt(filtroAlumnoHistorial));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Asistencias</h2>
      </div>

      {/* BOTONERA DE PESTAÑAS */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setPestañaActiva('tomar')}
          className={`px-6 py-2 font-bold rounded-t-lg transition-colors ${
            pestañaActiva === 'tomar' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📝 Tomar Lista
        </button>
        <button 
          onClick={() => setPestañaActiva('historial')}
          className={`px-6 py-2 font-bold rounded-t-lg transition-colors ${
            pestañaActiva === 'historial' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🔍 Ver Historial
        </button>
      </div>

      {/* PESTAÑA 1: TOMAR ASISTENCIA */}
      {pestañaActiva === 'tomar' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Seleccionar Clase</label>
              <select 
                value={claseSeleccionada}
                onChange={(e) => setClaseSeleccionada(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">-- Elegir una clase --</option>
                {clases.map(c => (
                  <option key={c.idClase} value={c.idClase}>Clase {c.idClase}: {c.dias} ({c.horario})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fecha de la Clase</label>
              <input 
                type="date" 
                value={fechaAsistencia} 
                onChange={(e) => setFechaAsistencia(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {claseSeleccionada ? (
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                Alumnos Inscriptos ({alumnosDeLaClase.length})
              </h3>
              {alumnosDeLaClase.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {alumnosDeLaClase.map(alumno => (
                    <div key={alumno.idAlumno} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">{alumno.nombre} {alumno.apellido}</span>
                      <button
                        onClick={() => toggleAsistencia(alumno.idAlumno)}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${
                          estadosAsistencia[alumno.idAlumno] === 'Presente' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                        }`}
                      >
                        {estadosAsistencia[alumno.idAlumno] === 'Presente' ? '✅ Presente' : '❌ Ausente'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-6">No hay alumnos activos inscriptos en esta clase.</p>
              )}
              <div className="flex justify-end">
                <button 
                  onClick={guardarAsistencia}
                  disabled={alumnosDeLaClase.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg shadow-sm"
                >
                  Guardar Asistencia
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">👆</span>
              Seleccioná una clase arriba para tomar lista
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: VER HISTORIAL */}
      {pestañaActiva === 'historial' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Filtrar por Alumno Específico</label>
            <select 
              value={filtroAlumnoHistorial}
              onChange={(e) => setFiltroAlumnoHistorial(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">👥 Todos los alumnos (Mostrar todo el historial)</option>
              {alumnos.map(a => (
                <option key={a.idAlumno} value={a.idAlumno}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800 text-white uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Alumno</th>
                  <th className="px-6 py-4">Clase / Horario</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialFiltrado.length > 0 ? (
                  historialFiltrado.map(registro => {
                    const elAlumno = alumnos.find(a => a.idAlumno === registro.idAlumno);
                    const laClase = clases.find(c => c.idClase === registro.idClase);

                    return (
                      <tr key={registro.idAsistencia} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-700">
                          {/* Formateamos la fecha para que se lea lindo */}
                          {new Date(registro.fecha).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {elAlumno ? `${elAlumno.nombre} ${elAlumno.apellido}` : 'Desconocido'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {laClase ? `${laClase.dias} (${laClase.horario})` : 'Clase Borrada'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            registro.estado === 'Presente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {registro.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                      No hay registros de asistencia para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Asistencias;