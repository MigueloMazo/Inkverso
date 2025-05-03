import React from 'react'
import { Link } from 'react-router-dom'

export default function BarraNavegacion() {
  return (
    <nav className="barra-nav">
      <div className="barra-nav__grupo--izquierda">
        <Link to="/" className="barra-nav__logo">Inkverso</Link>
      </div>
      <div className="barra-nav__grupo--centro">
        <Link to="/catalogo">Catálogo de Libros</Link>
        <Link to="/login">Iniciar Sesión</Link>
        <Link to="/registro">Regístrate</Link>
        <Link to="/administracion">Administracion</Link>
      </div>
      <div className="barra-nav__grupo--derecha">
        <Link to="/carrito" className="barra-nav__icono--carrito">🛒</Link>
      </div>
    </nav>
  )
}