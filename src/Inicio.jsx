import { useState, useEffect } from 'react';
import axios from 'axios';
import logoSammasati from './assets/Sammasati Logo.png'; 

function Inicio() {
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [totalInscripciones, setTotalInscripciones] = useState(0);

  useEffect(() => {
    // Vamos a buscar los datos a la API para mostrar métricas reales
    axios.get('https://localhost:7132/api/Alumnos')
      .then(res => {
        if (Array.isArray(res.data)) {
          setTotalAlumnos(res.data.length);
        }
      })
      .catch(err => console.error("Error al cargar métricas de alumnos"));

    axios.get('https://localhost:7132/api/Inscripciones')
      .then(res => {
        if (Array.isArray(res.data)) {
          // Filtramos para contar solo las activas, si querés
          const activas = res.data.filter(ins => ins.estado === 'Activa');
          setTotalInscripciones(activas.length);
        }
      })
      .catch(err => console.error("Error al cargar métricas de inscripciones"));
  }, []);

  return (
    <div className="p-8">
      {/* SECCIÓN HERO CON EL LOGO */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 flex flex-col md:flex-row items-center justify-center gap-8 border border-gray-200">
        
        {/* Mostramos la imagen del logo */}
        <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full overflow-hidden border-4 border-emerald-100">
          <img 
            src={logoSammasati} 
            alt="Logo Sammasati" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
            Bienvenido a Sammasati
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Panel de control administrativo. Desde aquí podrás gestionar a tus alumnos, 
            controlar las inscripciones a las clases y monitorear el estado general del centro.
          </p>
        </div>
      </div>

      {/* SECCIÓN DE TARJETAS DE MÉTRICAS */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Sistema</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Alumnos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-200 border-l-4 border-l-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Alumnos</p>
            <p className="text-3xl font-bold text-gray-900">{totalAlumnos}</p>
          </div>
          <div className="text-4xl">👥</div>
        </div>

        {/* Tarjeta 2: Inscripciones Activas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 border-l-4 border-l-blue-600 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Inscripciones Activas</p>
            <p className="text-3xl font-bold text-gray-900">{totalInscripciones}</p>
          </div>
          <div className="text-4xl">🧘‍♀️</div>
        </div>

        {/* Tarjeta 3: Preparada para los pagos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 border-l-4 border-l-orange-500 flex items-center justify-between opacity-70">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Cuotas al Día</p>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </div>
          <div className="text-4xl">💳</div>
        </div>

      </div>
    </div>
  );
}

export default Inicio;