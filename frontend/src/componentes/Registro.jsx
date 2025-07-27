import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/register.css'
import axios from 'axios'; // Cliente HTTP para hacer peticiones al backend

// Componente de registro
export default function Regist() {
  const navigate = useNavigate() // Hook para redirigir después del registro
  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({}) // Errores individuales o generales
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    // Actualiza el estado con el nuevo valor
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpia el error del campo al empezar a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  // Validación de los campos del formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres'
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo válido'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return newErrors
  }

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm() // Validar antes de enviar
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return // Si hay errores, no continúa
    }

    setIsLoading(true) // Activa spinner o desactiva botón
    
    try {
      // Armar objeto para enviar
      const userData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      }
      
      console.log('Datos a enviar:', userData)
      
      // Enviar datos al backend, por ahora Local
      const response = await axios.post('http://localhost:4000/api/auth/register', userData);

      const { user, token } = response.data;

      // Guarda el token en localStorage (para mantener la sesión)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Usuario registrado exitosamente:', user);
      
      // Tras registro exitoso, redirigir
      navigate('/catalogo', { 
        state: { 
          message: 'Cuenta creada exitosamente. Por favor inicia sesión.' 
        }
      })
    } catch (error) {
      console.error('Error en registro:', error)
      setErrors({ general: 'Error al crear la cuenta. Por favor intenta de nuevo.' })

      // Manejo de errores de red o de validación del backend
      if (error.response) {
          const errorMessage = error.response.data?.error || 'Error al crear la cuenta'
          setErrors({ general: errorMessage })
        } else if (error.request) {
          setErrors({ general: 'No se pudo conectar al servidor. Verifica tu conexión.' })
        } else {
          setErrors({ general: 'Error inesperado. Por favor intenta de nuevo.' })
        }
      } finally {
        setIsLoading(false) // Siempre apagar el loading
      }
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

          {/* Error general si el registro falla */}
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {/* Nombre */}
          <div className="input-group">
            <label htmlFor="firstName">Nombre *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          {/* Apellido */}
          <div className="input-group">
            <label htmlFor="lastName">Apellido *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Tu apellido"
              required
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          {/* Correo electrónico */}
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label htmlFor="password">Contraseña *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={errors.password ? 'error' : ''}
              />
              {/* Botón para mostrar/ocultar */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <div className="password-requirements">
              <small>Mínimo 8 caracteres, una mayúscula, una minúscula y un número</small>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Botón de registro */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>

          {/* Enlace a login */}
          <div className="register-links">
            <span>¿Ya tienes cuenta?</span>{' '}
            <Link to="/login">Inicia Sesión</Link>
          </div>
        </form>
      </main>

      <Footer />
    </>
  )
}