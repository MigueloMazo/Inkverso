import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '../componentes/Landing'
// importa más páginas cuando las tengas

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/catalogo" element={<Catalogo />} /> */}
      </Routes>
    </BrowserRouter>
  )
}