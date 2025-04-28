import React, { useEffect } from 'react'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/landing.css'

export default function Landing() {
  useEffect(() => {
    document.body.classList.add('landing')
    return () => {
      document.body.classList.remove('landing')
    }
  }, [])

  return (
    <>
      <head>
        <title>Inkverso - Home</title>
        <meta name="description" content="Bienvenido a Inkverso, tu destino para los mejores libros." /> 
      </head>

      <BarraNavegacion />

      <main className="landing-container">
        <div className="landing-left">
          <img
            src="./imagenes/BestSeller1.jpg"
            alt="Descripción de tu imagen"
          />
        </div>
        <div className="landing-right">
          <p className="intro-text">
          Solo los mejores, solo los más leídos.  Reunimos los libros que están marcando historia, 
          las novelas que todos comentan y los éxitos que no puedes dejar pasar. Si está en boca de todos, lo encuentras aquí.
          ¡Conviértete en parte de la élite de la lectura
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}