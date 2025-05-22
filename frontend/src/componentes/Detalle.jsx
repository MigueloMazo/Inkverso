import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/detalles.css'  // Estilos específicos para la vista de detalle

const books = [ // Simulación de datos de libros
    {
    id: 1,
    category: 'Ficción',
    title: 'Ficción 1',
    author: 'F. Scott Fitzgerald',
    description:'Una novela clásica de F. Scott Fitzgerald sobre ambición y amor en los años 20.',
    price: 45000,
    rating: 4.5,
    releaseDate: '1925-04-10',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 2,
    category: 'Ciencia',
    title: 'Ciencia 1',
    author: 'Stephen Hawking',
    description:'Reflexiones finales sobre el universo y la vida.',
    price: 60000,
    rating: 4.8,
    releaseDate: '2018-10-16',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 3,
    category: 'Misterio',
    title: 'Misterio 1',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 4,
    category: 'Misterio',
    title: 'Misterio 2',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 5,
    category: 'Misterio',
    title: 'Misterio 3',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 6,
    category: 'Misterio',
    title: 'Misterio 4',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 7,
    category: 'Misterio',
    title: 'Misterio 5',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 8,
    category: 'Misterio',
    title: 'Misterio 6',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
    {
    id: 9,
    category: 'Misterio',
    title: 'Misterio 7',
    author: 'George Orwell',
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total enterate de este maravilloso libro y de su electrizante contenido que puedes disfrutar tu y toda tu familia.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
]

export default function DetalleLibro() {
  const { id } = useParams()                     // Captura el ID desde la URL
  const book = books.find(b => b.id === parseInt(id))

  // Estados para comentarios
  const [comments, setComments] = useState([
    { user: 'Ana', text: 'Me encantó esta lectura.', rating: 5 },
    { user: 'Carlos', text: 'Interesante pero denso.', rating: 4 },
  ])
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)

  // Maneja el envío de un nuevo comentario
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!newComment || newRating === 0) return
    setComments([...comments, { user: 'Tú', text: newComment, rating: newRating }])
    setNewComment('')
    setNewRating(0)
  }

  if (!book) {
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
        {/* Imagen a la izquierda (desktop) o centrada (móvil) */}
        <div className="detalle-image">
          <img src={book.image} alt={book.title} />
        </div>

        {/* Información del libro */}
        <div className="detalle-info">
          <h2 className="detalle-title">{book.title}</h2>
          <ul className="detalle-list">
            <li><strong>Autor:</strong> {book.author}</li>
            <li><strong>Año de publicación:</strong> {new Date(book.releaseDate).getFullYear()}</li>
            <li><strong>Descripción:</strong> {book.description}</li>
            <li><strong>Puntuación:</strong> {book.rating} ⭐</li>
          </ul>
          <button className="btn-carrito">🛒 Añadir al carrito</button>

          {/* Sección de comentarios */}
          <section className="detalle-comments">
            <h3>Comentarios</h3>
            <ul className="comments-list">
              {comments.map((c, i) => (
                <li key={i} className="comment-item">
                  <span className="comment-user">{c.user}:</span>
                  <span className="comment-text"> {c.text}</span>
                  <span className="comment-rating"> ({c.rating} ⭐)</span>
                </li>
              ))}
            </ul>

            {/* Formulario para nuevo comentario */}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario"
                required
              />
              <label htmlFor="rating-select">
                Tu puntuación:
                <select
                  id="rating-select"
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
