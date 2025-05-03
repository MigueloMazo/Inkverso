import React from 'react'
import { useParams } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
//import '../assets/styles/detalle.css'

export default function DetalleLibro() {
  const { id } = useParams()  // Captura el :id de la URL

  return (
    <>
      <BarraNavegacion />

      <main className="detalle-container">
        <h2>Detalle del Libro #{id}</h2>
        <p>Esta vista mostrará información completa del libro. (En construcción)</p>
        {/* EN DESARROLLO */}
      </main>

      <Footer />
    </>
  )
}