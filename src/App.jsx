import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Importamos todas las pantallas
import Inicio from './Inicio';
import ListaAlumnos from './ListaAlumnos';
import Inscripciones from './Inscripciones';
import Pagos from './Pagos';
import Reportes from './Reportes';
import Asistencias from './Asistencias';
import Login from './Login'; // <-- NUEVA PANTALLA

function App() {
  // Estado para saber si el usuario está logueado
  const [usuario, setUsuario] = useState(null);

  // Al cargar la app, revisamos si ya había iniciado sesión antes
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioSammasati');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioSammasati');
    setUsuario(null);
  };

  // SI NO HAY USUARIO LOGUEADO, SOLO MOSTRAMOS EL LOGIN
  if (!usuario) {
    return <Login onLoginExitoso={(datos) => setUsuario(datos)} />;
  }

  // SI ESTÁ LOGUEADO, MOSTRAMOS LA APLICACIÓN
  const esAdmin = usuario.rol === 'Administrador';

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        
        {/* BARRA LATERAL / MENÚ DE NAVEGACIÓN */}
        <nav className="bg-gray-800 w-full md:w-64 text-white p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-400">Sammasati</h2>
            <p className="text-xs text-gray-400 mt-1">
              Usuario: {usuario.email}
              <br/>
              Rol: <span className="text-emerald-300 font-bold">{usuario.rol}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-grow">
            {/* ENLACES PARA EL ADMINISTRADOR (Ve todo) */}
            {esAdmin && (
              <>
                <Link to="/" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">🏠 Inicio (Dashboard)</Link>
                <Link to="/alumnos" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">👥 Alumnos</Link>
                <Link to="/inscripciones" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">🧘‍♀️ Inscripciones</Link>
                <Link to="/pagos" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">💳 Pagos</Link>
                <Link to="/reportes" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">📊 Reportes</Link>
              </>
            )}

            {/* ENLACE PARA TODOS (Admin y Profe ven asistencias) */}
            <Link to="/asistencias" className="text-gray-300 hover:text-white font-bold py-2 border-b border-gray-700">📝 Asistencias</Link>
          </div>

          <button 
            onClick={cerrarSesion}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </nav>

        {/* ÁREA PRINCIPAL DONDE SE CARGAN LAS PANTALLAS */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Si un profe intenta entrar a la fuerza escribiendo la URL, lo pateamos a Asistencias */}
            <Route path="/" element={esAdmin ? <Inicio /> : <Navigate to="/asistencias" />} />
            
            {esAdmin && (
              <>
                <Route path="/alumnos" element={<ListaAlumnos />} />
                <Route path="/inscripciones" element={<Inscripciones />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/reportes" element={<Reportes />} />
              </>
            )}

            <Route path="/asistencias" element={<Asistencias />} />
            
            {/* Ruta por defecto por si escriben cualquier cosa */}
            <Route path="*" element={<Navigate to={esAdmin ? "/" : "/asistencias"} />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;