import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/register.css'   // Estilos específicos

export default function Regist() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Llamar a la API para crear el usuario
    navigate('/')  // Tras registro, redirigir a login, pero cambiar despues al catalogo de libros
  }

  return (
    <>
      <head>
        <title>Inkverso – Registro</title>
        <meta name="description" content="Crea tu cuenta en Inkverso." />
      </head>

      <BarraNavegacion />

      <main className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>

          {/* Nombre completo */}
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Tu nombre completo"
            required
          />

          {/* Correo electrónico */}
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="tu@correo.com"
            required
          />

          {/* Contraseña */}
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
          />

          {/* Botón de registro */}
          <button type="submit">Registrarse</button>

          {/* Enlace a login */}
          <div className="register-links">
            <span>¿Ya tienes cuenta?</span>{' '}
            <Link to="/login">Inicia Sesión</Link>
          </div>

          {/*
            // Botón de login con Google (requiere backend OAuth):
            <div className="register-google">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/auth/google'
                }}
              >
                Iniciar sesión con Google
              </button>
            </div>
          */}
        </form>
      </main>

      <Footer />
    </>
  )
}