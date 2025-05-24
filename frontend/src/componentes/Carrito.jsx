// src/pages/Carrito.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/carrito.css'

// Datos de ejemplo
const initialCart = [
  { id: 1, title: 'El Gran Gatsby', author: 'F. Scott Fitzgerald', price: 45000, quantity: 1, image: '/imagenes/BestSeller1.jpg' },
  { id: 2, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', price: 60000, quantity: 2, image: '/imagenes/BestSeller1.jpg' },
]

export default function Carrito() {
  const [cartItems, setCartItems] = useState(initialCart)
  const [paymentMethod, setPaymentMethod] = useState('credit') // 'credit' o 'debit'
  const [address, setAddress] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // Totales
  const subtotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [cartItems])
  const shipping = 15000
  const total = subtotal + shipping
  const itemCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems])

  // Fecha estimada: hoy + 5 días
  const estimatedDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  // Redirecciones de pago
  const handleMP = () => {
    if (!isSaved) return alert('Guarda tu dirección primero.')
    const prefId = 'TEST_PREF_ID'
    window.location.href = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${prefId}`
  }
  const handlePSE = () => {
    if (!isSaved) return alert('Guarda tu dirección primero.')
    window.location.href = `https://pse.com.co/sandbox/payment?amount=${total}`
  }

  // Guardar / editar dirección
  const handleSaveAddress = () => {
    if (!address.trim()) return alert('Ingresa una dirección válida.')
    setIsSaved(prev => !prev)
  }

  return (
    <>
      <BarraNavegacion />

      <main className="carrito-container">
        {/* IZQUIERDA: Artículos + dirección */}
        <div className="carrito-content">
          <h1>Tu Carrito ({itemCount} artículos)</h1>
          <div className="carrito-items">
            {cartItems.length === 0 ? (
              <p>Carrito vacío. <Link to="/catalogo">Ver catálogo</Link></p>
            ) : cartItems.map(item => (
              <div key={item.id} className="carrito-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-info">
                  <h2 className="item-title">{item.title}</h2>
                  <p className="item-author">{item.author}</p>
                  <p className="item-price">Precio unitario: ${item.price}</p>
                  <div className="item-quantity">
                    <button onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button>
                    <button className="item-remove" onClick={() => setCartItems(prev => prev.filter(i => i.id !== item.id))}>
                    Eliminar
                    </button>
                  </div>
                </div>
                <p className="item-subtotal">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="shipping-address">
            <label htmlFor="address">Dirección de envío:</label>
            <input
              id="address"
              type="text"
              placeholder="Ingresa tu dirección"
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={isSaved}
            />
            <button className="btn-save-address" onClick={handleSaveAddress}>
              {isSaved ? 'Editar Dirección' : 'Guardar Dirección'}
            </button>
          </div>
        </div>

        {/* DERECHA: Resumen y pago */}
        <aside className="carrito-sidebar">
          <h2>Resumen de Compra</h2>
          <p className="resumen-line"><span>Subtotal:</span> <strong>${subtotal}</strong></p>
          <p className="resumen-line"><span>Envío:</span> <strong>${shipping}</strong></p>
          <p className="resumen-line total"><span>Total:</span> <strong>${total}</strong></p>
          <p className="resumen-line"><span>Ciudad:</span> <strong>{isSaved ? address : '---'}</strong></p>
          <p className="resumen-line"><span>Entrega estimada:</span> <strong>{estimatedDate}</strong></p>
          <hr />

          <div className="payment-section">
            <label>
              <input
                type="radio"
                name="pay"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={() => setPaymentMethod('credit')}
              />
              Tarjeta de Crédito
            </label>
            <label>
              <input
                type="radio"
                name="pay"
                value="debit"
                checked={paymentMethod === 'debit'}
                onChange={() => setPaymentMethod('debit')}
              />
              Pago PSE (débito)
            </label>
          </div>

          {paymentMethod === 'credit' ? (
            <button className="btn-pagar btn-pagar--large" onClick={handleMP}>
              Pagar con Mercado Pago
            </button>
          ) : (
            <button className="btn-pagar btn-pagar--large" onClick={handlePSE}>
              Pagar con PSE
            </button>
          )}
        </aside>
      </main>

      <Footer />
    </>
  )
}
