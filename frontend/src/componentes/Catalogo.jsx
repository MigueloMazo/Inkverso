import { Link } from 'react-router-dom'
import React, { useState, useMemo } from 'react'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/catalogo.css'

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

export default function Catalogo() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortType, setSortType] = useState('release')
    const [sortDirection, setSortDirection] = useState('desc')

    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setSelectedCategory('')
        setSearchTerm('')
        setSortType('release')
        setSortDirection('desc')
    }

    // Maneja clic en categoría
    const handleCategoryClick = (cat) => {
        setSelectedCategory(prev => (prev === cat ? '' : cat))
    }

    // Actualizar búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // Cambia tipo y dirección de ordenamiento
    const handleSortChange = (type, direction) => {
        setSortType(type)
        setSortDirection(direction)
    }

    // Obtener categorías únicas de los libros
    const categories = [...new Set(books.map(book => book.category))].sort()

    // Resultado filtrado y ordenado
    const filteredBooks = useMemo(() => {
        let results = [...books]

        // Filtrar por categoría
        if (selectedCategory) {
            results = results.filter(b => b.category === selectedCategory)
        }

        // Filtrar por texto de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            results = results.filter(
                b =>
                    b.title.toLowerCase().includes(term) ||
                    b.author.toLowerCase().includes(term)
            )
        }

        // Ordenar
        results.sort((a, b) => {
            let diff = 0
            if (sortType === 'price') {
                diff = a.price - b.price
            } else if (sortType === 'rating') {
                diff = a.rating - b.rating
            } else {
                diff = new Date(a.releaseDate) - new Date(b.releaseDate)
            }
            return sortDirection === 'asc' ? diff : -diff
        })

        return results
    }, [selectedCategory, searchTerm, sortType, sortDirection])

    return (
        <div className="catalogo-container">
            
            <BarraNavegacion />
            
            <main className="catalogo-main">
                <section className="catalogo-header">
                    <h1 className="catalogo-title">Catálogo de Libros</h1>
                    <p className="catalogo-subtitle">
                        Descubre {books.length} títulos increíbles • {filteredBooks.length} resultados
                    </p>
                </section>

                <section className="catalogo-filtros">
                    <div className="catalogo-filtros__primario">
                        <div className="catalogo-filtros__titulo">Categorías:</div>
                        <div className="catalogo-filtros__categorias">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`categoria-btn ${
                                        selectedCategory === cat ? 'active' : ''
                                    }`}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                            {/* Botón para limpiar filtros */}
                            <button
                                onClick={clearAllFilters}
                                className="categoria-btn clear-btn"
                                title="Limpiar todos los filtros"
                            >
                                Limpiar Filtros ×
                            </button>
                        </div>

                        {/* Filtros de ordenamiento para móvil */}
                        <div className="catalogo-filtros__mobile-filtros">
                            {['price', 'rating', 'release'].map(type => (
                                <div key={type} className="filtro-campo">
                                    <label htmlFor={`sort-${type}-m`}>
                                        {type === 'price'
                                            ? 'Precio'
                                            : type === 'rating'
                                            ? 'Rating'
                                            : 'Fecha'}
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

                        {/* Buscador */}
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

                    {/* Ordenamientos en desktop */}
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
                                        src={book.image} 
                                        alt={`Portada de ${book.title}`}
                                        loading="lazy"
                                    />
                                    {book.stock <= 5 && (
                                        <span className="stock-badge">¡Pocas unidades!</span>
                                    )}
                                </div>
                                <div className="book-card__info">
                                    <div className="book-card__header">
                                        <h3 className="book-card__title">{book.title}</h3>
                                        <div className="book-card__rating">
                                            <span className="rating-stars">
                                                {'★'.repeat(Math.floor(book.rating))}
                                                {'☆'.repeat(5 - Math.floor(book.rating))}
                                            </span>
                                            <span className="rating-number">({book.rating})</span>
                                        </div>
                                    </div>
                                    <p className="book-card__author">por {book.author}</p>
                                    <p className="book-card__desc">{book.description}</p>
                                    <div className="book-card__footer">
                                        <div className="book-card__price-info">
                                            <span className="book-card__price">${book.price.toLocaleString()}</span>
                                            <span className="book-card__stock">Stock: {book.stock}</span>
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
                                                disabled={book.stock === 0}
                                                aria-label={`Agregar ${book.title} al carrito`}
                                            >
                                                {book.stock > 0 ? '🛒 Agregar' : 'Agotado'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}