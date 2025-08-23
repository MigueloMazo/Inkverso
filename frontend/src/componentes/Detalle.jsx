import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/detalles.css'

export default function DetalleLibro() {
  const { id } = useParams()
  const [book, setBook] = useState(null) // Guarda la info del libro
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [comments, setComments] = useState([]) // Lista de comentarios del libro
  const [userName, setUserName] = useState('') //Nombre del usuario que comenta
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0) //Calificación que da el usuario (1-5)

  useEffect(() => { // Efecto que se ejecuta cuando cambia el `id` (cuando se abre otro libro)
    const fetchBook = async () => { //Obtener datos del libro desde el backend
      try {
        const res = await fetch(`http://localhost:4000/api/catalogo/${id}`)
        if (!res.ok) throw new Error('Libro no encontrado')
        const data = await res.json()
        setBook(data) // Guardar el libro en el estado

        const commentsRes = await fetch(`http://localhost:4000/api/catalogo/${id}/comments`) //Obtener los comentarios del libro
        const commentsData = await commentsRes.json()
        setComments(commentsData)
      } catch (err) {
        console.error('❌ Error cargando libro:', err.message)
        setError(err.message)
      } finally {
        setLoading(false) // Al final siempre se deja de cargar
      }
    }

    fetchBook()
  }, [id])

  const handleCommentSubmit = async (e) => { // Maneja el envío de un nuevo comentario
    e.preventDefault()
    if (!userName || newRating === 0) return

    const res = await fetch(`http://localhost:4000/api/catalogo/${id}/comments`, { //Enviar comentario al backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        rating: newRating,
        text: newComment
      })
    })

    if (res.ok) { //Si se guardó bien, actualizar lista de comentarios
      const updated = await fetch(`http://localhost:4000/api/catalogo/${id}/comments`)
      const data = await updated.json()
      setComments(data)
      setUserName('')
      setNewRating(0)
      setNewComment('')
    }
  }

  if (loading) {
    return (
      <>
        <BarraNavegacion />
        <main className="detalle-container">
          <p>Cargando detalles del libro...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !book) {
    return (
      <>
        <BarraNavegacion />
        <main className="detalle-container">
          <p>Libro no encontrado.</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <BarraNavegacion />

      <main className="detalle-container">
        <div className="detalle-image">
          <img src={book.cover_url} alt={`Portada de ${book.title}`} />
        </div>

        <div className="detalle-info">
          <h2 className="detalle-title">{book.title}</h2>
          <ul className="detalle-list">
            <li><strong>Autor:</strong> {book.author}</li>
            <li><strong>Año de publicación:</strong> {new Date(book.published_date).getFullYear()}</li>
            <li><strong>Descripción:</strong> {book.description}</li>
            <li><strong>Precio:</strong> ${book.price.toLocaleString()}</li>
            <li><strong>Stock disponible:</strong> {book.stock}</li>
          </ul>

          <button 
            className="btn-carrito"
            disabled={book.stock === 0}
          >
            {book.stock > 0 ? '🛒 Añadir al carrito' : 'Agotado'}
          </button>

          <section className="detalle-comments">
            <h3>Comentarios</h3>

            {comments.length === 0 ? (
              <p>Este libro aún no tiene comentarios.</p>
            ) : (
              <ul className="comments-list">
                {comments.map((c, i) => (
                  <li key={i} className="comment-item">
                    <span className="comment-user">{c.user_name}:</span>
                    <span className="comment-text"> {c.text || 'Sin observación'}</span>
                    <span className="comment-rating"> ({c.rating} ⭐)</span>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                placeholder="Tu nombre"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                required
              />

              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Tu comentario (opcional)"
              />

              <label>
                Calificación:
                <select
                  value={newRating}
                  onChange={e => setNewRating(parseInt(e.target.value))}
                  required
                >
                  <option value={0}>Selecciona</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} ⭐</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="btn-submit-comment">
                Enviar comentario
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
