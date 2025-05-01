import React from 'react'
import { Link, useNavigate } from 'react-router-dom'  // Para redirigir tras el submit
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/forgot-password.css'         // Estilos específicos

export default function ForgotPassword() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logica o API para enviar el código de recuperación
    // Por ahora a Login
    navigate('/login')
  }

  return (
    <>
      <head>
        <title>Inkverso – Recuperar Contraseña</title>
        <meta name="description" content="Recupera tu contraseña en Inkverso." />
      </head>

      <BarraNavegacion />

      <main className="forgot-container">
        <form className="forgot-form" onSubmit={handleSubmit}>
          <h2>Recuperar Contraseña</h2>

          <p className="forgot-form__info">
            Te enviaremos un código de recuperación al correo que ingresaste. 
            Por favor, ingresa el código recibido y tus nuevas credenciales.
          </p>

          {/* Input para el código de recuperación */}
          <label htmlFor="code">Código de recuperación</label>
          <input
            type="text"
            id="code"
            name="code"
            placeholder="Ingresa el código"
            required
          />

          {/* Input para la nueva contraseña */}
          <label htmlFor="new-password">Nueva contraseña</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            placeholder="••••••••"
            required
          />

          {/* Input para repetir la contraseña */}
          <label htmlFor="confirm-password">Repetir contraseña</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="••••••••"
            required
          />

          {/* Botón de recuperación */}
          <button type="submit">Recuperar Contraseña</button>

          {/* Link para reenviar el código */}
          <div className="forgot-form__resend">
            <span>¿No recibiste el código?</span>{' '}
            <Link to="/forgot-password">Reenviar código</Link>
          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}
