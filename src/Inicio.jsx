import { useState, useEffect } from 'react';
import axios from 'axios';
import logoSammasati from './assets/Sammasati Logo.png';

function Inicio() {
  // 1. Estados para guardar toda la información de la base de datos cruda
  const [listaAlumnos, setListaAlumnos] = useState([]);
  const [listaInscripciones, setListaInscripciones] = useState([]);
  const [listaPagos, setListaPagos] = useState([]);
  const [listaClases, setListaClases] = useState([]);
  const [listaEspacios, setListaEspacios] = useState([]);

  // 2. Estados para el FILTRO DE FECHA (por defecto arrancan en hoy)
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());

  // 3. Estados visuales (Totales y Finanzas)
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [totalInscripciones, setTotalInscripciones] = useState(0);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [gananciaCentro, setGananciaCentro] = useState(0);
  const [ingresosAconcagua, setIngresosAconcagua] = useState(0);
  const [ingresosParaguay, setIngresosParaguay] = useState(0);

  // EFECTO 1: Trae todos los datos de la API una sola vez cuando entrás a la página
  useEffect(() => {
    Promise.all([
      axios.get('https://localhost:7132/api/Alumnos'),
      axios.get('https://localhost:7132/api/Inscripciones'),
      axios.get('https://localhost:7132/api/PagosCuotas'),
      axios.get('https://localhost:7132/api/Clases'),
      axios.get('https://localhost:7132/api/Espacios')
    ]).then(([resAlumnos, resInsc, resPagos, resClases, resEspacios]) => {
      setListaAlumnos(resAlumnos.data || []);
      setListaInscripciones(resInsc.data || []);
      setListaPagos(resPagos.data || []);
      setListaClases(resClases.data || []);
      setListaEspacios(resEspacios.data || []);
    }).catch(err => console.error("Error al cargar los datos del dashboard", err));
  }, []);

  // EFECTO 2: Calcula los números de nuevo CADA VEZ que cambiás el mes, el año, o cargan los datos
  useEffect(() => {
    // Totales fijos
    setTotalAlumnos(listaAlumnos.length);
    setTotalInscripciones(listaInscripciones.filter(i => i.estado === 'Activa').length);

    // Filtramos los pagos usando los selectores de pantalla
    const pagosDelFiltro = listaPagos.filter(
      p => p.mes === parseInt(mesFiltro) && p.anio === parseInt(anioFiltro) && p.estado === 'Abonado'
    );

    let totalMes = 0;
    let totalAcon = 0;
    let totalPara = 0;

    pagosDelFiltro.forEach(pago => {
      totalMes += pago.monto;

      const inscripcionAlumno = listaInscripciones.find(
        i => i.idAlumno === pago.idAlumno && i.estado === 'Activa'
      );

      if (inscripcionAlumno) {
        const claseAsignada = listaClases.find(c => c.idClase === inscripcionAlumno.idClase);
        if (claseAsignada) {
          const espacioAsignado = listaEspacios.find(e => e.idEspacio === claseAsignada.idEspacio);
          if (espacioAsignado) {
            const nombreLugar = espacioAsignado.nombreDireccion.toLowerCase();
            if (nombreLugar.includes('aconcagua')) {
              totalAcon += pago.monto;
            } else if (nombreLugar.includes('paraguay')) {
              totalPara += pago.monto;
            }
          }
        }
      }
    });

    setIngresosTotales(totalMes);
    setGananciaCentro(totalMes * 0.30); // 30% del total de ese mes
    setIngresosAconcagua(totalAcon);
    setIngresosParaguay(totalPara);

  }, [mesFiltro, anioFiltro, listaAlumnos, listaInscripciones, listaPagos, listaClases, listaEspacios]);

  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="p-8">
      {/* SECCIÓN HERO */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 flex flex-col md:flex-row items-center justify-center gap-8 border border-gray-200">
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
            controlar las inscripciones y monitorear las finanzas históricas.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Sistema</h3>
      
      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-200 border-l-4 border-l-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Alumnos</p>
            <p className="text-3xl font-bold text-gray-900">{totalAlumnos}</p>
          </div>
          <div className="text-4xl">👥</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 border-l-4 border-l-blue-600 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Inscripciones Activas</p>
            <p className="text-3xl font-bold text-gray-900">{totalInscripciones}</p>
          </div>
          <div className="text-4xl">🧘‍♀️</div>
        </div>
      </div>

      {/* TARJETA FINANCIERA CON FILTROS */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 border-t-4 border-t-orange-500">
        
        {/* Controles para cambiar de mes y año */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💳</span>
            <h4 className="text-xl font-bold text-gray-800">Cierre Financiero</h4>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={mesFiltro} 
              onChange={(e) => setMesFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none font-medium text-gray-700 bg-white"
            >
              {nombresMeses.map((nombre, i) => (
                <option key={i} value={i + 1}>{nombre}</option>
              ))}
            </select>
            
            <input 
              type="number" 
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-orange-500 outline-none w-24 font-medium text-gray-700 text-center"
            />
          </div>
        </div>
        
        {/* Los cálculos automáticos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Recaudación Bruta</p>
            <p className="text-2xl font-bold text-gray-800">
              ${ingresosTotales.toLocaleString('es-AR')}
            </p>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase font-bold mb-1">Ganancia Centro (30%)</p>
            <p className="text-2xl font-bold text-emerald-700">
              ${gananciaCentro.toLocaleString('es-AR')}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-800">📍 Aconcagua:</span>
              <span className="font-bold text-blue-900">${ingresosAconcagua.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between items-center border-t border-blue-200 pt-2">
              <span className="text-sm font-semibold text-blue-800">📍 Paraguay:</span>
              <span className="font-bold text-blue-900">${ingresosParaguay.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Inicio;