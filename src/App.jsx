import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuNavegacion from './MenuNavegacion';
import ListaAlumnos from './ListaAlumnos';
import Inscripciones from './Inscripciones';

function Inicio() {
  return (
    <div className="p-8 text-center bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-4xl font-bold text-emerald-800 mb-4">Bienvenido al Panel Sammasati</h2>
      <p className="text-gray-600 text-lg">Seleccioná una opción del menú superior para comenzar a gestionar el centro.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <MenuNavegacion />
        
        <main className="container mx-auto mt-6 px-4">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/alumnos" element={<ListaAlumnos />} />
            
            {/* ACÁ CONECTAMOS LA RUTA AL COMPONENTE */}
            <Route path="/inscripciones" element={<Inscripciones />} />
            
            <Route path="/pagos" element={<div className="p-8 text-center font-bold text-gray-500">Módulo de Pagos (En construcción)</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;