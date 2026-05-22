import { Link, useLocation } from 'react-router-dom';

function MenuNavegacion() {
  const location = useLocation();

  // Esta funcioncita nos ayuda a pintar de distinto color el botón si estamos en esa página
  const claseBoton = (ruta) => {
    return `px-4 py-2 rounded-md font-semibold transition-colors ${
      location.pathname === ruta 
        ? 'bg-emerald-900 text-white' 
        : 'text-emerald-100 hover:bg-emerald-600'
    }`;
  };

  return (
    <nav className="bg-emerald-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center flex-col md:flex-row gap-4">
        
        {/* Logo / Título */}
        <div className="text-white text-2xl font-bold tracking-widest">
          SAMMASATI
        </div>

        {/* Botones de Navegación */}
        <div className="flex gap-2 flex-wrap justify-center">
          <Link to="/" className={claseBoton('/')}>Inicio</Link>
          <Link to="/alumnos" className={claseBoton('/alumnos')}>Gestión de Alumnos</Link>
          <Link to="/inscripciones" className={claseBoton('/inscripciones')}>Inscripciones</Link>
          <Link to="/pagos" className={claseBoton('/pagos')}>Pagos</Link>
          <Link to="/reportes" className={claseBoton('/reportes')}>Reportes</Link>
          <Link to="/asistencias" className={claseBoton('/asistencias')}>Asistencias</Link>
        </div>

      </div>
    </nav>
  );
}

export default MenuNavegacion;