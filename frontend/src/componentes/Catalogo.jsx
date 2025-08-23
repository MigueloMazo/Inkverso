import { Link } from 'react-router-dom'
import React, { useEffect, useState, useMemo } from 'react'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/catalogo.css'

export default function Catalogo() {
  const [books, setBooks] = useState([]) //Lista de libros cargados desde la API
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('release')
  const [sortDirection, setSortDirection] = useState('desc')
  const [user, setUser] = useState(null)
  const [addingToCart, setAddingToCart] = useState({}) // Para manejar estado de loading por libro

  // Obtener usuario autenticado
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
  }, [])  // Solo al montar el componente

  //Cargar libros desde la API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/catalogo') //Petición al backend
        const json = await res.json()
        setBooks(json.books || [])
      } catch (err) {
        console.error('🚨 Error cargando libros:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  // Función para agregar libro al carrito
  const addToCart = async (bookId, quantity = 1) => {
    if (!user?.id) {
      alert('Debes iniciar sesión para agregar productos al carrito')
      return
    }
    // Validamos que venga un ID de libro válido
    if (!bookId) {
      alert('Error: ID de libro inválido')
      return
    }

    try {
      // Activar estado de loading para este libro específico
      setAddingToCart(prev => ({ ...prev, [bookId]: true }))

      const response = await fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: bookId,
          quantity: quantity
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Error ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      console.log('✅ Libro agregado al carrito:', data)
      
      // Emitir evento personalizado para actualizar contador del carrito
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      
      // Mostrar mensaje de éxito
      alert('¡Libro agregado al carrito exitosamente!')
      
    } catch (err) {
      console.error('💥 Error agregando al carrito:', err)
      alert(`Error al agregar al carrito: ${err.message}`)
    } finally {
      // Desactivar estado de loading para este libro
      setAddingToCart(prev => ({ ...prev, [bookId]: false }))
    }
  }

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedCategory('')
    setSearchTerm('')
    setSortType('release')
    setSortDirection('desc')
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(prev => (prev === cat ? '' : cat))
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSortChange = (type, direction) => {
    setSortType(type)
    setSortDirection(direction)
  }

  // Obtener lista única de categorías
  const categories = [...new Set(books.map(book => book.category || 'Sin categoría'))].sort()

  const filteredBooks = useMemo(() => {
    let results = [...books]

    if (selectedCategory) {
      results = results.filter(b => b.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        b =>
          (b.title || '').toLowerCase().includes(term) ||
          (b.author || '').toLowerCase().includes(term)
      )
    }

    // Ordenar según rating y precio
    results.sort((a, b) => {
      let diff = 0
      if (sortType === 'price') {
        diff = a.price - b.price
      } else if (sortType === 'rating') {
        diff = (a.rating || 0) - (b.rating || 0)
      } else {
        diff = new Date(a.published_date) - new Date(b.published_date)
      }
      return sortDirection === 'asc' ? diff : -diff
    })

    return results
  }, [books, selectedCategory, searchTerm, sortType, sortDirection])

  return (
    <div className="catalogo-container">
      <BarraNavegacion />

      <main className="catalogo-main">
        <section className="catalogo-header">
          <h1 className="catalogo-title">Catálogo de Libros</h1>
          <p className="catalogo-subtitle">
            {loading
              ? 'Cargando libros...'
              : `Descubre ${books.length} títulos increíbles • ${filteredBooks.length} resultados`}
          </p>
        </section>

        {!loading && (
          <>
            <section className="catalogo-filtros">
              <div className="catalogo-filtros__primario">
                <div className="catalogo-filtros__titulo">Categorías:</div>
                <div className="catalogo-filtros__categorias">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`categoria-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="categoria-btn clear-btn"
                    title="Limpiar todos los filtros"
                  >
                    Limpiar Filtros ×
                  </button>
                </div>

                <div className="catalogo-filtros__mobile-filtros">
                  {['price', 'rating', 'release'].map(type => (
                    <div key={type} className="filtro-campo">
                      <label htmlFor={`sort-${type}-m`}>
                        {type === 'price' ? 'Precio' : type === 'rating' ? 'Rating' : 'Fecha'}
                      </label>
                      <select
                        id={`sort-${type}-m`}
                        value={sortType === type ? sortDirection : 'desc'}
                        onChange={e => handleSortChange(type, e.target.value)}
                      >
                        <option value="desc">
                          {type === 'release' ? 'Más reciente' : 'Mayor a menor'}
                        </option>
                        <option value="asc">
                          {type === 'release' ? 'Menos reciente' : 'Menor a mayor'}
                        </option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="catalogo-filtros__busqueda">
                  <input
                    type="text"
                    placeholder="Buscar por título o autor..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Buscar libros"
                  />
                </div>
              </div>

              <div className="catalogo-filtros__secundario">
                {['price', 'rating', 'release'].map(type => (
                  <div key={type} className="filtro-campo">
                    <label htmlFor={`sort-${type}`}>
                      {type === 'price'
                        ? 'Precio de Venta'
                        : type === 'rating'
                        ? 'Puntuación'
                        : 'Lanzamiento'}
                    </label>
                    <select
                      id={`sort-${type}`}
                      value={sortType === type ? sortDirection : 'desc'}
                      onChange={e => handleSortChange(type, e.target.value)}
                    >
                      <option value="desc">
                        {type === 'release' ? 'Más reciente' : 'Mayor a menor'}
                      </option>
                      <option value="asc">
                        {type === 'release' ? 'Menos reciente' : 'Menor a mayor'}
                      </option>
                    </select>
                  </div>
                ))}
              </div>
            </section>

            <section className="catalogo-lista">
              {filteredBooks.length === 0 ? (
                <div className="catalogo-empty">
                  <h3>No se encontraron resultados</h3>
                  <p>Intenta ajustar tus filtros o términos de búsqueda</p>
                  <button onClick={clearAllFilters} className="btn-empty">
                    Ver todos los libros
                  </button>
                </div>
              ) : (
                filteredBooks.map(book => (
                  <article key={book.id} className="book-card">
                    <div className="book-card__image">
                      <img
                        src={book.cover_url || '/imagenes/BestSeller1.jpg'}
                        alt={`Portada de ${book.title}`}
                        loading="lazy"
                      />
                      {book.stock <= 5 && book.stock > 0 && (
                        <span className="stock-badge">¡Pocas unidades!</span>
                      )}
                      {book.stock === 0 && (
                        <span className="stock-badge" style={{backgroundColor: '#dc3545'}}>Agotado</span>
                      )}
                    </div>
                    <div className="book-card__info">
                      <div className="book-card__header">
                        <h3 className="book-card__title">{book.title}</h3>
                        <div className="book-card__rating">
                          <span className="rating-stars">
                            {'★'.repeat(Math.floor(book.rating || 0))}
                            {'☆'.repeat(5 - Math.floor(book.rating || 0))}
                          </span>
                          <span className="rating-number">({book.rating || 0})</span>
                        </div>
                      </div>
                      <p className="book-card__author">por {book.author}</p>
                      <p className="book-card__desc">{book.description}</p>
                      <div className="book-card__footer">
                        <div className="book-card__price-info">
                          <span className="book-card__price">
                            ${book.price?.toLocaleString() || 0}
                          </span>
                          <span className="book-card__stock">
                            Stock: {book.stock}
                          </span>
                        </div>
                        <div className="book-card__actions">
                          <Link
                            to={`/detalle/${book.id}`}
                            className="btn-detalles"
                            aria-label={`Ver detalles de ${book.title}`}
                          >
                            Ver Detalles
                          </Link>
                          <button
                            className="btn-carrito"
                            disabled={book.stock === 0 || addingToCart[book.id] || !user}
                            onClick={() => addToCart(book.id, 1)}
                            aria-label={`Agregar ${book.title} al carrito`}
                          >
                            {!user 
                              ? '🔒 Inicia sesión'
                              : book.stock === 0 
                              ? 'Agotado'
                              : addingToCart[book.id]
                              ? '⏳ Agregando...'
                              : '🛒 Agregar'
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        {loading && (
          <div className="catalogo-loading">
            <p>Cargando libros...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}