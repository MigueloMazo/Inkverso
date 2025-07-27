import React, { useState } from 'react' // Hook para manejar estado en el componente
import { Link, useNavigate } from 'react-router-dom'        
import BarraNavegacion from '../componentes/BarraNavegacion'  
import Footer from '../componentes/Footer'      
import '../assets/styles/login.css'             


// Componente principal de Login
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Estado de carga (muestra "Ingresando...")
  const [error, setError] = useState(''); // Estado para mostrar errores
  const navigate = useNavigate(); // Hook para redirigir

  // Actualiza el estado cada vez que se escribe en un input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Envía una solicitud POST al backend para autenticar
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir al usuario (ajusta la ruta según tu aplicación)
        navigate('/catalogo'); // o la ruta que corresponda
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      // Si hay error de red/conexión
      console.error('Error de conexión:', err);
      setError(`Error de conexión: ${err.message}. Verifica que el servidor esté ejecutándose.`);
    } finally {
      setLoading(false); // Siempre desactiva el loading al final
    }
  };

  return (
    <>
      <head>
        <title>Inkverso – Iniciar Sesión</title>
        <meta name="description" content="Accede a tu cuenta de Inkverso." />
      </head>

      <BarraNavegacion />

      {/* Contenedor principal centrado */}
      <main className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>

          {/* Mostrar error si existe */}
          {error && (
            <div className="error-message" style={{ 
              color: '#e74c3c', 
              backgroundColor: '#fdf2f2', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px',
              border: '1px solid #e74c3c'
            }}>
              {error}
            </div>
          )}

          {/* Campo de correo */}
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            required
            disabled={loading}
          />

          {/* Campo de contraseña */}
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
          />

          {/* Botón de envío */}
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {/* Enlaces de ayuda */}
          <div className="login-links">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/Registro">Registrate</Link>
          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}