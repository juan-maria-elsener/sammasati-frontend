import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuNavegacion from './MenuNavegacion';
import ListaAlumnos from './ListaAlumnos';
import Inscripciones from './Inscripciones';
import Inicio from './Inicio';

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