import { useState, useEffect } from 'react';
import axios from 'axios';

function Reportes() {
  // Estados para almacenar la base de datos cruda
  const [alumnos, setAlumnos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [clases, setClases] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [pagos, setPagos] = useState([]);

  // Estados para los BOTONES DE FILTRADO
  const [profeSeleccionado, setProfeSeleccionado] = useState('Todos');
  const [espacioSeleccionado, setEspacioSeleccionado] = useState('Todos');
  const [estadoInscripcion, setEstadoInscripcion] = useState('Todos'); // 'Todos' o 'Activa'
  const [estadoPago, setEstadoPago] = useState('Todos'); // 'Todos', 'Abonado', 'Pendiente'

  useEffect(() => {
    // Traemos todo el ecosistema de la base de datos
    Promise.all([
      axios.get('https://localhost:7132/api/Alumnos'),
      axios.get('https://localhost:7132/api/Inscripciones'),
      axios.get('https://localhost:7132/api/Clases'),
      axios.get('https://localhost:7132/api/Profesores'),
      axios.get('https://localhost:7132/api/Espacios'),
      axios.get('https://localhost:7132/api/PagosCuotas')
    ]).then(([resAl, resIns, resCl, resPr, resEs, resPa]) => {
      setAlumnos(resAl.data || []);
      setInscripciones(resIns.data || []);
      setClases(resCl.data || []);
      setProfesores(resPr.data || []);
      setEspacios(resEs.data || []);
      setPagos(resPa.data || []);
    }).catch(err => console.error("Error al cargar reportes", err));
  }, []);

  // OBTENER MES Y AÑO ACTUAL PARA EL FILTRO DE PAGO
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  // LA MAGIA DEL FILTRADO: Procesamos la lista en tiempo real
  const alumnosFiltrados = alumnos.filter(alumno => {
    // 1. Buscar inscripciones de este alumno
    const misInscripciones = inscripciones.filter(i => i.idAlumno === alumno.idAlumno);
    
    // Filtro por Alumno Activo (Tiene al menos una inscripción activa)
    const tieneInscripcionActiva = misInscripciones.some(i => i.estado === 'Activa');
    if (estadoInscripcion === 'Activa' && !tieneInscripcionActiva) return false;

    // 2. Buscar clases y relaciones (Profesor y Espacio) a través de sus inscripciones
    const misClases = clases.filter(c => 
      misInscripciones.some(i => i.idClase === c.idClase)
    );

    // Filtro por Profesor
    if (profeSeleccionado !== 'Todos') {
      const vaConEsteProfe = misClases.some(c => c.idProfesor === parseInt(profeSeleccionado));
      if (!vaConEsteProfe) return false;
    }

    // Filtro por Espacio / Sede
    if (espacioSeleccionado !== 'Todos') {
      const vaAEsteEspacio = misClases.some(c => c.idEspacio === parseInt(espacioSeleccionado));
      if (!vaAEsteEspacio) return false;
    }

    // 3. Buscar pago del mes actual para ver estado financiero
    const pagoEsteMes = pagos.find(
      p => p.idAlumno === alumno.idAlumno && p.mes === mesActual && p.anio === anioActual
    );
    const estadoPagoReal = pagoEsteMes ? pagoEsteMes.estado : 'Pendiente'; // Si no hay registro, debe el mes

    if (estadoPago !== 'Todos' && estadoPagoReal !== estadoPago) return false;

    return true;
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Filtros Avanzados y Reportes</h2>
      <p className="text-sm text-gray-500 mb-6">Filtrado inteligente cruzado en tiempo real.</p>

      {/* PANEL DE BOTONES Y SELECTORES DE FILTRADO */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Filtro Profesor */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Por Profesor</label>
          <select 
            value={profeSeleccionado}
            onChange={(e) => setProfeSeleccionado(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
          >
            <option value="Todos">👥 Todos los Profesores</option>
            {profesores.map(p => (
              <option key={p.idProfesor} value={p.idProfesor}>Prof. {p.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro Espacio */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Por Sede / Espacio</label>
          <select 
            value={espacioSeleccionado}
            onChange={(e) => setEspacioSeleccionado(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
          >
            <option value="Todos">📍 Todas las Sedes</option>
            {espacios.map(e => (
              <option key={e.idEspacio} value={e.idEspacio}>{e.nombreDirection || e.nombreDireccion}</option>
            ))}
          </select>
        </div>

        {/* Filtro Alumno Activo */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Estado Académico</label>
          <div className="flex gap-1">
            <button 
              onClick={() => setEstadoInscripcion('Todos')}
              className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                estadoInscripcion === 'Todos' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setEstadoInscripcion('Activa')}
              className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                estadoInscripcion === 'Activa' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Activos 🧘‍♀️
            </button>
          </div>
        </div>

        {/* Filtros Financieros (Abonado / Pendiente) */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Condición de Pago (Mes Actual)</label>
          <div className="flex gap-1">
            <button 
              onClick={() => setEstadoPago('Todos')}
              className={`px-2 py-2 text-xs font-bold rounded border transition-colors flex-1 ${
                estadoPago === 'Todos' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setEstadoPago('Abonado')}
              className={`px-2 py-2 text-xs font-bold rounded border transition-colors flex-1 ${
                estadoPago === 'Abonado' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Abonados
            </button>
            <button 
              onClick={() => setEstadoPago('Pendiente')}
              className={`px-2 py-2 text-xs font-bold rounded border transition-colors flex-1 ${
                estadoPago === 'Pendiente' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Deudores
            </button>
          </div>
        </div>

      </div>

      {/* RECUENTO DE ENCONTRADOS */}
      <div className="mb-4 text-sm font-semibold text-gray-600">
        Resultados encontrados: <span className="text-emerald-700 font-bold text-base">{alumnosFiltrados.length}</span> alumnos.
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-800 text-white uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Alumno</th>
              <th className="px-6 py-4">Clases Inscriptas</th>
              <th className="px-6 py-4">Profesor/es</th>
              <th className="px-6 py-4">Sede/s</th>
              <th className="px-6 py-4 text-center">Pago Mes Actual</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.length > 0 ? (
              alumnosFiltrados.map(alumno => {
                // Obtener relaciones para las celdas
                const misInsc = inscripciones.filter(i => i.idAlumno === alumno.idAlumno);
                const misCl = clases.filter(c => misInsc.some(i => i.idClase === c.idClase));
                
                const misProfes = profesores.filter(p => misCl.some(c => c.idProfesor === p.idProfesor));
                const misEspacios = espacios.filter(e => misCl.some(c => c.idSpace === e.idEspacio || c.idEspacio === e.idEspacio));

                const pagoMes = pagos.find(p => p.idAlumno === alumno.idAlumno && p.mes === mesActual && p.anio === anioActual);
                const estadoP = pagoMes ? pagoMes.estado : 'Pendiente';

                return (
                  <tr key={alumno.idAlumno} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {alumno.nombre} {alumno.apellido}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {misCl.length > 0 ? misCl.map(c => `${c.dias} (${c.horario})`).join(', ') : 'Ninguna'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {misProfes.length > 0 ? misProfes.map(p => p.nombre).join(', ') : '---'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {misEspacios.length > 0 ? misEspacios.map(e => e.nombreDirection || e.nombreDireccion).join(' | ') : '---'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        estadoP === 'Abonado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {estadoP}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">
                  Ningún alumno coincide con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reportes;