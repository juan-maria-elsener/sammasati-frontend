import { useState } from 'react';
import axios from 'axios';
import logoSammasati from './assets/Sammasati Logo.png';

function Login({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    axios.post('https://localhost:7132/api/Auth/login', {
      email: email,
      password: password
    })
    .then(response => {
      // Guardamos los datos del usuario en la memoria del navegador
      const datosUsuario = response.data;
      localStorage.setItem('usuarioSammasati', JSON.stringify(datosUsuario));
      
      // Le avisamos a App.jsx que ya puede dejarlo pasar
      onLoginExitoso(datosUsuario);
    })
    .catch(err => {
      setCargando(false);
      if (err.response && err.response.status === 401) {
        setError('Email o contraseña incorrectos.');
      } else {
        setError('Error al conectar con el servidor.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-full border-4 border-emerald-100 overflow-hidden">
            <img src={logoSammasati} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acceso al Sistema</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Ingresá tus credenciales para continuar</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="ejemplo@sammasati.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition-colors mt-4"
          >
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;