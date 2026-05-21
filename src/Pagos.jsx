import { useState, useEffect } from 'react';
import axios from 'axios';

function Pagos() {
  const [alumnos, setAlumnos] = useState([]);
  const [pagos, setPagos] = useState([]);

  // Estados del formulario
  const [idAlumno, setIdAlumno] = useState('');
  const [mes, setMes] = useState(new Date().getMonth() + 1); // Mes actual por defecto
  const [anio, setAnio] = useState(new Date().getFullYear()); // Año actual por defecto
  const [monto, setMonto] = useState('');
  const [estado, setEstado] = useState('Abonado');
  
  const [fechaPago, setFechaPago] = useState(() => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  });

  const cargarDatos = () => {
    // 1. Cargamos Alumnos para el desplegable y cruzar datos
    axios.get('https://localhost:7132/api/Alumnos')
      .then(res => setAlumnos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error al cargar alumnos:", err));

    // 2. Cargamos el historial de Pagos
    axios.get('https://localhost:7132/api/PagosCuotas')
      .then(res => setPagos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Error al cargar pagos:", err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();

    // 1. Validación preventiva
    if (!idAlumno) {
      alert("⚠️ Cuidado: No seleccionaste ningún alumno.");
      return;
    }

    // 2. Armamos el paquete obligando a que los números sean números
    const nuevoPago = {
      idAlumno: parseInt(idAlumno) || 0,
      mes: parseInt(mes) || 0,
      anio: parseInt(anio) || 0,
      estado: estado,
      monto: parseFloat(monto) || 0,
      
      // VAMOS A PROBAR ALGO: Si esto era el problema, mandarlo en null debería dejarlo pasar.
      fechaPago: fechaPago
    };

    // 3. LA RADIOGRAFÍA: Esto va a imprimir en la consola qué le estamos mandando exactamente
    console.log("📦 PAQUETE EXACTO QUE VIAJA A C#:", JSON.stringify(nuevoPago, null, 2));

    axios.post('https://localhost:7132/api/PagosCuotas', nuevoPago)
      .then(response => {
        alert("¡Registro de pago guardado correctamente!");
        setIdAlumno('');
        setMonto('');
        cargarDatos(); 
      })
      .catch(error => {
        console.error("Error al registrar pago:", error);
        alert("Sigue rebotando. Revisá la consola para ver qué paquete se envió.");
      });
  };

  // Aprovechamos el endpoint personalizado de tu controlador C#
  const cobrarCuotaPendiente = (id) => {
    axios.put(`https://localhost:7132/api/PagosCuotas/cobrar/${id}`)
      .then(response => {
        alert("¡Cuota marcada como cobrada exitosamente!");
        cargarDatos(); // Refrescamos la tabla para ver el cambio
      })
      .catch(error => {
        console.error("Error al cobrar:", error);
        alert("No se pudo procesar el cobro.");
      });
  };

  const eliminarPago = (id) => {
    if (window.confirm("¿Seguro que querés eliminar este registro?")) {
      axios.delete(`https://localhost:7132/api/PagosCuotas/${id}`)
        .then(() => cargarDatos())
        .catch(() => alert("No se pudo eliminar el registro."));
    }
  };

  // Nombres de los meses para mostrar más lindo
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Pagos</h2>

      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-emerald-800 mb-4">Registrar Nuevo Pago o Deuda</h3>
        
        <form onSubmit={manejarEnvio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="col-span-1 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
            <select 
              value={idAlumno}
              onChange={(e) => setIdAlumno(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>-- Seleccionar Alumno --</option>
              {alumnos.map(a => (
                <option key={a.idAlumno} value={a.idAlumno}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
            <select 
              value={mes} 
              onChange={(e) => setMes(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
            >
              {nombresMeses.map((nombre, i) => (
                <option key={i} value={i + 1}>{nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
            <input 
              type="number" 
              value={anio} 
              onChange={(e) => setAnio(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={monto} 
              onChange={(e) => setMonto(e.target.value)}
              required
              placeholder="Ej: 15000"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
            <input 
              type="date" 
              value={fechaPago} 
              onChange={(e) => setFechaPago(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select 
              value={estado} 
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
            >
              <option value="Abonado">Abonado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>

      {/* TABLA HISTORIAL */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Historial de Cuotas</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="px-6 py-4">Alumno</th>
              <th className="px-6 py-4">Período</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Fecha Pago</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 ? (
              pagos.map((pago) => {
                const alumno = alumnos.find(a => a.idAlumno === pago.idAlumno);
                return (
                  <tr key={pago.idPago} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {alumno ? `${alumno.nombre} ${alumno.apellido}` : `ID: ${pago.idAlumno}`}
                    </td>
                    <td className="px-6 py-4">
                      {nombresMeses[pago.mes - 1]} {pago.anio}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      ${pago.monto}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {pago.fechaPago ? pago.fechaPago.split('T') : '---'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        pago.estado === 'Abonado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pago.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {pago.estado === 'Pendiente' && (
                        <button 
                          onClick={() => cobrarCuotaPendiente(pago.idPago)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold hover:bg-blue-200"
                        >
                          Cobrar
                        </button>
                      )}
                      <button 
                        onClick={() => eliminarPago(pago.idPago)}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-100 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pagos;