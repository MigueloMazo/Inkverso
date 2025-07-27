import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function BarraNavegacion() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)   // Estado para controlar si el menú está abierto (modo móvil)
  const [user, setUser] = useState(null)   // Estado para guardar los datos del usuario (si está autenticado)

  // Hook que se ejecuta al montar el componente: carga los datos del usuario desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')           // Obtenemos el token guardado
    const userData = localStorage.getItem('user')         // Obtenemos la info del usuario guardada
    
    if (token && userData) {                              
      try {
        const parsedUser = JSON.parse(userData)           // Intentamos parsear los datos del usuario
        setUser(parsedUser)                               // Guardamos el usuario en el estado
      } catch (error) {                                   
        console.error('Error parsing user data:', error)  
        localStorage.removeItem('user')                   // Eliminamos datos corruptos del localStorage
        localStorage.removeItem('token')
      }
    }
  }, []) 

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Función para cerrar sesión: borra token y usuario del localStorage y resetea el estado
  const handleLogout = () => {
    localStorage.removeItem('token')  // Quitamos el token
    localStorage.removeItem('user')   // Quitamos los datos del usuario
    setUser(null)                     // Quitamos el usuario del estado
    setIsMenuOpen(false)             // Cerramos el menú si estaba abierto
  }

  return (
    <nav className="barra-nav"> 
      <div className="barra-nav__contenedor">

        <div className="barra-nav__grupo--izquierda">
          <Link to="/" className="barra-nav__logo">Inkverso</Link> 
        </div>
        <button 
          className="barra-nav__hamburguesa"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span></span> {/* Linea 1 */}
          <span></span> {/* Linea 2 */}
          <span></span> {/* Linea 3 */}
        </button>

        {/* Menú central con enlaces de navegación. Se muestra u oculta según isMenuOpen */}
        <div className={`barra-nav__grupo--centro ${isMenuOpen ? 'barra-nav__grupo--centro--activo' : ''}`}>
          <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo de Libros</Link>

          {/* Si el usuario NO está autenticado, mostramos enlaces para login y registro */}
          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
              <Link to="/registro" onClick={() => setIsMenuOpen(false)}>Regístrate</Link>
            </>
          ) : (
            // Si el usuario está autenticado, mostramos botón de cerrar sesión
            <button 
              onClick={handleLogout}
              className="barra-nav__logout-btn"
            >
              Cerrar Sesión
            </button>
          )}

          {/* Enlace a la vista de administración (Se limitara mas adelante segun permisos de usuario) */}
          <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Administración</Link>
        </div>

        <div className="barra-nav__grupo--derecha">
          {/* Si hay usuario, mostramos saludo personalizado */}
          {user && (
            <span className="barra-nav__usuario">
              Hola, {user.first_name}
            </span>
          )}

          <Link to="/carrito" className="barra-nav__icono--carrito" aria-label="Carrito de compras">
            🛒
          </Link>
        </div>

      </div>
    </nav>
  )
}
