import { useState, useEffect } from 'react';
import axios from 'axios';

function Inscripciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [clases, setClases] = useState([]);
  
  // NUEVOS ESTADOS: Para guardar los catálogos extra
  const [profesores, setProfesores] = useState([]);
  const [espacios, setEspacios] = useState([]);

  const [idAlumno, setIdAlumno] = useState('');
  const [idClase, setIdClase] = useState('');
  const [estado, setEstado] = useState('Activa');

  useEffect(() => {
    // Traemos todo en paralelo cuando carga la pantalla
    axios.get('https://localhost:7132/api/Alumnos')
      .then(res => setAlumnos(Array.isArray(res.data) ? res.data : []));

    axios.get('https://localhost:7132/api/Clases')
      .then(res => setClases(Array.isArray(res.data) ? res.data : []));

    // NUEVAS LLAMADAS: Traemos a los profes y los lugares
    axios.get('https://localhost:7132/api/Profesores')
      .then(res => setProfesores(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log("Aún no hay endpoint de Profesores"));

    axios.get('https://localhost:7132/api/Espacios')
      .then(res => setEspacios(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log("Aún no hay endpoint de Espacios"));
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
      })
      .catch(error => {
        console.error("Error al inscribir:", error);
        alert("Hubo un error al guardar la inscripción.");
      });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inscripciones</h2>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
                // Buscamos quién es el profe de esta clase
                const profe = profesores.find(p => p.idProfesor === clase.idProfesor);
                const nombreProfe = profe ? profe.nombre : `Profe #${clase.idProfesor}`;

                // Buscamos cuál es el espacio de esta clase
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
    </div>
  );
}

export default Inscripciones;