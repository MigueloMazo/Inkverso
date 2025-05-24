import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '../componentes/Landing'
import Login from '../componentes/Login'
import ForgotPassword from '../componentes/ForgotPassword' 
import Registro from '../componentes/Registro'
import Catalogo from '../componentes/Catalogo'
import DetalleLibro from '../componentes/Detalle'
import Carrito from '../componentes/Carrito'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/detalle/:id" element={<DetalleLibro />} />  
        <Route path="/carrito" element={<Carrito />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </BrowserRouter>
  )
}