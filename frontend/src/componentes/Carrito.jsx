import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/carrito.css'

export default function Carrito() {
  const [cartData, setCartData] = useState(null) // Info del carrito (items, precios, etc.)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [address, setAddress] = useState('')  // Flag para bloquear/editar dirección
  const [isSaved, setIsSaved] = useState(false)
  const [updating, setUpdating] = useState({}) 
  const [user, setUser] = useState(null) // Usuario logueado

  // Obtener usuario autenticado
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (err) {
        console.error('Error parsing user data:', err)
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
  }, [])

  // Cargar carrito del usuario
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:4000/api/cart/${user.id}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error ${response.status}: ${errorText}`)
        }
        const data = await response.json()
        setCartData(data.cart)
      } catch (err) {
        console.error('💥 Error fetching cart:', err)
        setError(`Error al cargar el carrito: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  // Totales
  const subtotal = useMemo(() => {
    if (!cartData || !cartData.order_items) return 0
    return cartData.order_items.reduce((sum, item) => sum + item.total_price, 0)
  }, [cartData])

  const shipping = 15000 // Envío fijo por ahora
  const total = subtotal + shipping

  const itemCount = useMemo(() => {
    if (!cartData || !cartData.order_items) return 0
    return cartData.order_items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartData])

  const estimatedDate = useMemo(() => { // Fecha de entrega estimada (+5 días)
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  // Actualizar cantidad
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      setUpdating(prev => ({ ...prev, [`quantity_${itemId}`]: true }))
      const response = await fetch(`http://localhost:4000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      })
      if (!response.ok) throw new Error('Error al actualizar cantidad')

      const cartResponse = await fetch(`http://localhost:4000/api/cart/${user.id}`)
      const cartData = await cartResponse.json()
      setCartData(cartData.cart)

      window.dispatchEvent(new CustomEvent('cartUpdated')) // Actualiza el icono del carrito en nav
    } catch (err) {
      alert(err, 'Error al actualizar la cantidad')
    } finally {
      setUpdating(prev => ({ ...prev, [`quantity_${itemId}`]: false }))
    }
  }

  // Eliminar item
  const removeItem = async (itemId) => {
    try {
      setUpdating(prev => ({ ...prev, [`remove_${itemId}`]: true }))
      const response = await fetch(`http://localhost:4000/api/cart/remove/${itemId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Error al eliminar item')

      const cartResponse = await fetch(`http://localhost:4000/api/cart/${user.id}`)
      const cartData = await cartResponse.json()
      setCartData(cartData.cart)

      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (err) {
      alert(err, 'Error al eliminar el artículo')
    } finally {
      setUpdating(prev => ({ ...prev, [`remove_${itemId}`]: false }))
    }
  }

  // Pago con MercadoPago
  const handleMP = async () => {
    if (!isSaved) return alert('Guarda tu dirección primero.')
    if (!cartData || !cartData.id) return alert('No hay items en el carrito.')

    try {
      setUpdating(prev => ({ ...prev, mercadopago: true }))
      const response = await fetch(`http://localhost:4000/api/cart/mercadopago/${cartData.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      if (!response.ok) throw new Error('Error al crear preferencia de pago')

      //const { init_point } = await response.json()

      alert(`🎉 ¡Gracias por tu compra!
      
💳 Serás redirigido a Mercado Pago para completar tu pago
📦 Total a pagar: $${total.toLocaleString()}
📍 Dirección: ${address}
🚚 Entrega estimada: ${estimatedDate}`)

      window.open(`https://www.mercadopago.com.co/`, "_blank")
      //window.location.href = `https://www.mercadopago.com.co/`
    } catch (err) {
      alert('Error al procesar el pago: ' + err.message)
    } finally {
      setUpdating(prev => ({ ...prev, mercadopago: false }))
    }
  }

  // Pago con PSE
  const handlePSE = async () => {
    if (!isSaved) return alert('Guarda tu dirección primero.')
    if (!cartData || !cartData.id) return alert('No hay items en el carrito.')

    try {
      setUpdating(prev => ({ ...prev, pse: true }))
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(`🎉 ¡Gracias por tu compra!
      
💳 Serás redirigido a PSE para completar tu pago
📦 Total a pagar: $${total.toLocaleString()}
📍 Dirección: ${address}
🚚 Entrega estimada: ${estimatedDate}`)
      
      window.open(`https://www.pse.com.co/persona`, "_blank")
      //window.location.href = `https://www.pse.com.co/persona`
    } catch (err) {
      alert('Error al procesar el pago: ' + err.message)
    } finally {
      setUpdating(prev => ({ ...prev, pse: false }))
    }
  }

  // Guardar dirección
  const handleSaveAddress = () => {
    if (!address.trim()) return alert('Ingresa una dirección válida.')
    setIsSaved(prev => !prev)
  }

  if (loading || !user) {
    return (
      <>
        <BarraNavegacion />
        <main className="carrito-container">
          <div className="carrito-content">
            <h1>Cargando carrito...</h1>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <BarraNavegacion />
        <main className="carrito-container">
          <div className="carrito-content">
            <h1>Error al cargar el carrito</h1>
            <p>{error}</p>
            <Link to="/catalogo">Volver al catálogo</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const cartItems = cartData?.order_items || []

  return (
    <>
      <BarraNavegacion />
      <main className="carrito-container">
        {/* IZQUIERDA */}
        <div className="carrito-content">
          <h1>Tu Carrito ({itemCount} artículos)</h1>
          <div className="carrito-items">
            {cartItems.length === 0 ? (
              <p>Carrito vacío. <Link to="/catalogo">Ver catálogo</Link></p>
            ) : cartItems.map(item => (
              <div key={item.id} className="carrito-item">
                <img 
                  src={item.book?.cover_url || '/imagenes/BestSeller1.jpg'} 
                  alt={item.book?.title || 'Libro'} 
                  className="item-image" 
                />
                <div className="item-info">
                  <h2 className="item-title">{item.book?.title || 'Título no disponible'}</h2>
                  <p className="item-author">por {item.book?.author || 'Autor no especificado'}</p>
                  <p className="item-price">Precio unitario: ${item.unit_price?.toLocaleString() || 0}</p>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating[`quantity_${item.id}`] || item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating[`quantity_${item.id}`]}>+</button>
                    <button className="item-remove" onClick={() => removeItem(item.id)}
                      disabled={updating[`remove_${item.id}`]}>
                      {updating[`remove_${item.id}`] ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
                <p className="item-subtotal">${item.total_price?.toLocaleString() || 0}</p>
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

        {/* DERECHA */}
        <aside className="carrito-sidebar">
          <h2>Resumen de Compra</h2>
          <p className="resumen-line"><span>Subtotal:</span> <strong>${subtotal.toLocaleString()}</strong></p>
          <p className="resumen-line"><span>Envío:</span> <strong>${shipping.toLocaleString()}</strong></p>
          <p className="resumen-line total"><span>Total:</span> <strong>${total.toLocaleString()}</strong></p>
          <p className="resumen-line"><span>Ciudad:</span> <strong>{isSaved ? address : '---'}</strong></p>
          <p className="resumen-line"><span>Entrega estimada:</span> <strong>{estimatedDate}</strong></p>
          <hr />

          <div className="payment-section">
            <label>
              <input type="radio" name="pay" value="credit"
                checked={paymentMethod === 'credit'}
                onChange={() => setPaymentMethod('credit')} />
              Tarjeta de Crédito
            </label>
            <label>
              <input type="radio" name="pay" value="debit"
                checked={paymentMethod === 'debit'}
                onChange={() => setPaymentMethod('debit')} />
              Pago PSE (débito)
            </label>
          </div>

          {cartItems.length > 0 && (
            <>
              {paymentMethod === 'credit' ? (
                <button className="btn-pagar btn-pagar--large"
                  onClick={handleMP}
                  disabled={updating.mercadopago || !isSaved}>
                  {updating.mercadopago ? 'Procesando...' : 'Pagar con Mercado Pago'}
                </button>
              ) : (
                <button className="btn-pagar btn-pagar--large"
                  onClick={handlePSE}
                  disabled={updating.pse || !isSaved}>
                  {updating.pse ? 'Procesando...' : 'Pagar con PSE'}
                </button>
              )}
            </>
          )}
        </aside>
      </main>
      <Footer />
    </>
  )
}
