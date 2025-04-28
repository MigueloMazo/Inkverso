import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="pie-pagina__contenido">
        <div className="pie-pagina__contenido--izquierda">
          <a href="https://www.youtube.com" target="_blank" className="pie-pagina__icono--red-social">📱</a>
          <a href="https://www.facebook.com" target="_blank" className="pie-pagina__icono--red-social">📸</a>
          <a href="https://twitter.com" target="_blank" className="pie-pagina__icono--red-social">🐦</a>
        </div>
        <div className="pie-pagina__contenido--derecha">
          <span className="copyright">© 2025 Inkverso</span>
          <div className="pie-pagina__carrito">
            <Link to="/carrito" className="barra-nav__icono--carrito">🛒</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}