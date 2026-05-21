import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuNavegacion from './MenuNavegacion';
import ListaAlumnos from './ListaAlumnos';
import Inscripciones from './Inscripciones';
import Inicio from './Inicio';
import Pagos from './Pagos';
import Reportes from './Reportes';

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
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;