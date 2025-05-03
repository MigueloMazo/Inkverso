import { Link } from 'react-router-dom'
import React, { useState, useMemo } from 'react' //useState (para manejar estado) y useMemo (para memorizar el resultado del filtrado/orden)
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/catalogo.css'

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
    description:'La distopía de George Orwell que imagina un mundo de vigilancia y control total.',
    price: 50000,
    rating: 4.2,
    releaseDate: '1949-06-08',
    image: '/imagenes/BestSeller1.jpg',
    },
]

export default function Catalogo() {
    const [selectedCategory, setSelectedCategory] = useState('') //almacena la categoría activa.
    const [searchTerm, setSearchTerm] = useState('') //almacena el texto de búsqueda.
    const [sortType, setSortType] = useState('release')   // 'price', 'rating', 'release' 
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
        setSelectedCategory(prev => (prev === cat ? '' : cat)) // Si ya estaba seleccionada, la desmarca; si no, la marca
    }

    // Actualizar búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    // Cambia tipo y dirección de ordenamiento
    const handleSortChange = (type, direction) => {
        setSortType(type)
        setSortDirection(direction)
    }

    // Resultado filtrado y ordenado useMemo recalcula sólo cuando cambian sus dependencias,
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

        // Ordenar por precio
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

        return results;
    }, [selectedCategory, searchTerm, sortType, sortDirection]);

    
    return (
      <>
        <BarraNavegacion />

        <section className="catalogo-filtros">
            <div className="catalogo-filtros__primario">
            <div className="catalogo-filtros__titulo">Categorías: </div>
            <div className="catalogo-filtros__categorias">
                {['Ficción', 'No Ficción', 'Misterio', 'Romance', 'Ciencia'].map(
                (cat) => (
                    <button
                    key={cat}
                    className={`categoria-btn ${
                        selectedCategory === cat ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryClick(cat)}
                    >
                    {cat}
                    </button>
                )
                )}
                {/* Botón para limpiar filtros */}
                <button
                onClick={clearAllFilters}
                className="categoria-btn clear-btn"
                >
                Limpiar&nbsp;Filtros&nbsp;×
                </button>
            </div>

            {/* Filtros de ordenamiento para móvil */}
            <div className="catalogo-filtros__mobile-filtros">
            {['price', 'rating', 'release'].map(type => (
              <div key={type} className="filtro-campo">
                <label htmlFor={`sort-${type}-m`}>
                  {type === 'price'
                    ? 'Precio de Venta'
                    : type === 'rating'
                    ? 'Puntuación'
                    : 'Lanzamiento'}
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

            {/*Ordenamientos en desktop*/}
            <div className="catalogo-filtros__secundario">
            {['price', 'rating', 'release'].map(type => (
                <div key={type} className="filtro-campo"> {/*Cada tipo tendrá su propio "campo" visual de orden*/} 
                <label htmlFor={`sort-${type}`}>              
                    {type === 'price'
                    ? 'Precio de Venta'
                    : type === 'rating'
                    ? 'Puntuación'
                    : 'Lanzamiento'}
                </label>
                <select
                    id={`sort-${type}`}
                    value={sortType === type ? sortDirection : 'desc'} //Si este tipo es el que está activo, usamos su dirección actual (asc o desc)
                    onChange={e => handleSortChange(type, e.target.value)}  //Cuando cambia el valor del select, llamamos a la función para cambiar el orden
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
            {filteredBooks.map(book => ( //Recorremos los libros filtrados y ordenados
            <div key={book.id} className="book-card">
                <div className="book-card__image">
                <img src={book.image} alt={book.title} />
                </div>
                <div className="book-card__info">
                <h3 className="book-card__title">{book.title}</h3>
                <p className="book-card__desc">{book.description}</p>
                <div className="book-card__actions">
                    <Link to={`/detalle/${book.id}`} className="btn-detalles"> 
                    Detalles del Libro
                    </Link>{/* Botón para ver detalles del libro */}
                    <button className="btn-carrito">
                    ${book.price}🛒
                    </button>
                </div>
                </div>
            </div>
            ))}
        </section>

        <Footer />
        </>
    )
}