import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/detalles.css'  // Estilos específicos para la vista de detalle

const books = [
    {
        id: 1,
        category: 'Ficción',
        title: 'El Gran Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'Una novela clásica de F. Scott Fitzgerald sobre ambición y amor en los años 20.',
        price: 45000,
        rating: 4.5,
        releaseDate: '1925-04-10',
        image: '/imagenes/BestSeller1.jpg',
        stock: 15
    },
    {
        id: 2,
        category: 'Ciencia',
        title: 'Breves respuestas a las grandes preguntas',
        author: 'Stephen Hawking',
        description: 'Reflexiones finales sobre el universo y la vida del reconocido físico.',
        price: 60000,
        rating: 4.8,
        releaseDate: '2018-10-16',
        image: '/imagenes/BestSeller1.jpg',
        stock: 8
    },
    {
        id: 3,
        category: 'Misterio',
        title: '1984',
        author: 'George Orwell',
        description: 'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
        price: 50000,
        rating: 4.2,
        releaseDate: '1949-06-08',
        image: '/imagenes/BestSeller1.jpg',
        stock: 12
    },
    {
        id: 4,
        category: 'Misterio',
        title: 'El Nombre de la Rosa',
        author: 'Umberto Eco',
        description: 'Un misterio medieval lleno de simbolismo y filosofía en una abadía italiana.',
        price: 55000,
        rating: 4.6,
        releaseDate: '1980-09-01',
        image: '/imagenes/BestSeller1.jpg',
        stock: 6
    },
    {
        id: 5,
        category: 'Romance',
        title: 'Orgullo y Prejuicio',
        author: 'Jane Austen',
        description: 'La historia de amor entre Elizabeth Bennet y Mr. Darcy en la Inglaterra del siglo XIX.',
        price: 42000,
        rating: 4.7,
        releaseDate: '1813-01-28',
        image: '/imagenes/BestSeller1.jpg',
        stock: 20
    },
    {
        id: 6,
        category: 'No Ficción',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        description: 'Una fascinante exploración de la historia de la humanidad desde sus orígenes.',
        price: 65000,
        rating: 4.9,
        releaseDate: '2011-02-10',
        image: '/imagenes/BestSeller1.jpg',
        stock: 18
    },
    {
        id: 7,
        category: 'Ficción',
        title: 'Cien Años de Soledad',
        author: 'Gabriel García Márquez',
        description: 'La obra maestra del realismo mágico que narra la historia de los Buendía.',
        price: 48000,
        rating: 4.8,
        releaseDate: '1967-05-30',
        image: '/imagenes/BestSeller1.jpg',
        stock: 14
    },
    {
        id: 8,
        category: 'Ciencia',
        title: 'Cosmos',
        author: 'Carl Sagan',
        description: 'Un viaje fascinante por el universo de la mano del famoso astrónomo.',
        price: 52000,
        rating: 4.5,
        releaseDate: '1980-09-28',
        image: '/imagenes/BestSeller1.jpg',
        stock: 11
    },
    {
        id: 9,
        category: 'Romance',
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        description: 'La conmovedora historia de una joven huérfana que encuentra el amor y la independencia.',
        price: 44000,
        rating: 4.4,
        releaseDate: '1847-10-16',
        image: '/imagenes/BestSeller1.jpg',
        stock: 9
    }
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
