import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '../componentes/Landing'
import Login from '../componentes/Login'
import ForgotPassword from '../componentes/ForgotPassword' 
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/catalogo" element={<Catalogo />} /> */}
      </Routes>
    </BrowserRouter>
  )
}