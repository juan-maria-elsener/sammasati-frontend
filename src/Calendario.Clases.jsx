import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

function CalendarioClases() {
  const [eventos, setEventos] = useState([]);

  // Función ayudante para convertir tus textos de días a números para el calendario
  const traducirDiasANumeros = (textoDias) => {
    const diasNumeros = [];
    const textoMin = textoDias.toLowerCase();
    
    if (textoMin.includes('domingo')) diasNumeros.push(0);
    if (textoMin.includes('lunes')) diasNumeros.push(1);
    if (textoMin.includes('martes')) diasNumeros.push(2);
    if (textoMin.includes('miercoles') || textoMin.includes('miércoles')) diasNumeros.push(3);
    if (textoMin.includes('jueves')) diasNumeros.push(4);
    if (textoMin.includes('viernes')) diasNumeros.push(5);
    if (textoMin.includes('sabado') || textoMin.includes('sábado')) diasNumeros.push(6);
    
    return diasNumeros;
  };

  useEffect(() => {
    // Traemos las clases desde el backend
    axios.get('https://localhost:7132/api/Clases')
      .then(response => {
        const clasesDB = response.data || [];
        
        // Mapeamos los datos de MySQL al formato estricto de FullCalendar
        const eventosFormateados = clasesDB.map(clase => {
          return {
            id: clase.idClase,
            title: `Clase ${clase.idClase}`, // Podés cambiarlo si tenés un nombre de clase
            daysOfWeek: traducirDiasANumeros(clase.dias), // Le decimos qué días se repite
            startTime: clase.horario, // Hora de inicio (ej: "18:00")
            endTime: calcularHoraFin(clase.horario), // Calculamos 1 hora después
            backgroundColor: '#059669', // Color esmeralda de Tailwind
            borderColor: '#047857'
          };
        });

        setEventos(eventosFormateados);
      })
      .catch(error => console.error("Error al cargar clases para el calendario:", error));
  }, []);

  // Función simple para sumar 1 hora al horario de inicio (asumiendo que duran 1 hora)
  const calcularHoraFin = (horaInicio) => {
    if (!horaInicio) return "00:00";
    const [horas, minutos] = horaInicio.split(':');
    let horaFin = parseInt(horas) + 1;
    return `${horaFin.toString().padStart(2, '0')}:${minutos}`;
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Grilla de Horarios</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          events={eventos}
          slotMinTime="08:00:00" // El calendario arranca a las 8 AM
          slotMaxTime="22:00:00" // Termina a las 10 PM
          allDaySlot={false} // Sacamos la fila de "Todo el día"
          locale="es" // Lo pasamos a español
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: 'Hoy',
            week: 'Semana',
            day: 'Día'
          }}
          height="auto" // Se ajusta al contenido
        />
      </div>
    </div>
  );
}

export default CalendarioClases;