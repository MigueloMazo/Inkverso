// src/pages/Login.jsx
import React from 'react'
import { Link } from 'react-router-dom'        
import BarraNavegacion from '../componentes/BarraNavegacion'  
import Footer from '../componentes/Footer'      
import '../assets/styles/login.css'             

export default function Login() {
  return (
    <>
      <head>
        <title>Inkverso – Iniciar Sesión</title>
        <meta name="description" content="Accede a tu cuenta de Inkverso." />
      </head>

      <BarraNavegacion />

      {/* Contenedor principal centrado */}
      <main className="login-container">
        <form className="login-form">
          <h2>Iniciar Sesión</h2>

          {/* Campo de correo */}
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="tu@correo.com"
            required
          />

          {/* Campo de contraseña */}
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
          />

          {/* Botón de envío */}
          <button type="submit">Ingresar</button>

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
