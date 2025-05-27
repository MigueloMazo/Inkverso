import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/landing.css'

export default function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Array de imágenes - agrega aquí las rutas de tus imágenes
  const images = [
    "./imagenes/BestSeller1.jpg",
    "./imagenes/BestSeller1.jpg", // Agrega más imágenes aquí
    "./imagenes/BestSeller1.jpg",
    "./imagenes/BestSeller1.jpg"
  ]

  useEffect(() => {
    document.body.classList.add('landing')
    return () => {
      document.body.classList.remove('landing')
    }
  }, [])

  // Efecto para cambiar imágenes automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      )
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <>
      <head>
        <title>Inkverso - Home</title>
        <meta name="description" content="Bienvenido a Inkverso, tu destino para los mejores libros." /> 
      </head>

      <BarraNavegacion />

      <main className="landing-wrapper">
        <div className="landing-container">
          <div className="landing-left">
            <div className="image-container">
              <div className="image-carousel">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Best Seller ${index + 1}`}
                    className={`main-image ${index === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="image-glow"></div>
              
              {/* Indicadores de imagen */}
              <div className="image-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="landing-right">
            <div className="text-container">
              <h1 className="main-title">
                <span className="highlight">Solo los mejores,</span>
                <br />
                <span className="accent">solo los más leídos</span>
              </h1>
              <p className="intro-text">
                Reunimos los libros que están marcando historia, 
                las novelas que todos comentan y los éxitos que no puedes dejar pasar. 
                Si está en boca de todos, lo encuentras aquí.
              </p>
              <div className="cta-container">
                <Link to="/registro" className="cta-button">
                  <span>¡Conviértete en parte de la élite de la lectura!</span>
                  <div className="button-glow"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos flotantes */}
        <div className="floating-elements">
          <div className="floating-book floating-book-1"></div>
          <div className="floating-book floating-book-2"></div>
          <div className="floating-book floating-book-3"></div>
        </div>
      </main>

      <Footer />
    </>
  )
}