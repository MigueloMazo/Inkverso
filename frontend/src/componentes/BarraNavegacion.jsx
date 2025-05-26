import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function BarraNavegacion() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="barra-nav">
      <div className="barra-nav__contenedor">
        <div className="barra-nav__grupo--izquierda">
          <Link to="/" className="barra-nav__logo">Inkverso</Link>
        </div>
        
        {/* Botón hamburguesa para móvil */}
        <button 
          className="barra-nav__hamburguesa"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`barra-nav__grupo--centro ${isMenuOpen ? 'barra-nav__grupo--centro--activo' : ''}`}>
          <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Catálogo de Libros</Link>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
          <Link to="/registro" onClick={() => setIsMenuOpen(false)}>Regístrate</Link>
          <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Administración</Link>
        </div>

        <div className="barra-nav__grupo--derecha">
          <Link to="/carrito" className="barra-nav__icono--carrito" aria-label="Carrito de compras">
            🛒
          </Link>
        </div>
      </div>
    </nav>
  )
}