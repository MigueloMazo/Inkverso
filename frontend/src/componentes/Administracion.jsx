// src/pages/Admin.jsx
import React, { useState, useMemo } from 'react'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/admin.css'

// Datos de ejemplo
const sampleUsers = [
  { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', isSeller: false },
  { id: 2, name: 'Ana Gómez', email: 'ana.gomez@example.com', isSeller: true },
  { id: 3, name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', isSeller: false },
  { id: 4, name: 'María López', email: 'maria.lopez@example.com', isSeller: true },
  { id: 5, name: 'Pedro Martínez', email: 'pedro.martinez@example.com', isSeller: false },
]

const sampleBooks = [
  { 
    id: 1, 
    title: 'El Principito', 
    author: 'Antoine de Saint-Exupéry', 
    releaseDate: '1943-04-06', 
    price: 25000, 
    description: 'Un clásico de la literatura universal que narra la historia de un pequeño príncipe que viaja de planeta en planeta.', 
    stock: 10, 
    image: '/imagenes/BestSeller1.jpg' 
  },
  { 
    id: 2, 
    title: 'Cien Años de Soledad', 
    author: 'Gabriel García Márquez', 
    releaseDate: '1967-05-30', 
    price: 40000, 
    description: 'Obra maestra del realismo mágico que cuenta la historia de la familia Buendía.', 
    stock: 5, 
    image: '/imagenes/BestSeller1.jpg' 
  },
  { 
    id: 3, 
    title: 'Don Quijote de la Mancha', 
    author: 'Miguel de Cervantes', 
    releaseDate: '1605-01-16', 
    price: 35000, 
    description: 'La novela más importante de la literatura española y una de las primeras novelas modernas.', 
    stock: 8, 
    image: '/imagenes/BestSeller1.jpg' 
  },
]

export default function Admin() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState(sampleUsers)
  const [userSearch, setUserSearch] = useState('')

  const [books, setBooks] = useState(sampleBooks)
  const [bookSearch, setBookSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newBook, setNewBook] = useState({
    title: '', author: '', releaseDate: '', price: '', description: '', stock: '', image: ''
  })
  const [editingBookId, setEditingBookId] = useState(null)
  const [editBookData, setEditBookData] = useState({})

  // Filtrado de usuarios
  const filteredUsers = useMemo(
    () => users.filter(u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (userSearch.toLowerCase() === 'vendedor' && u.isSeller) ||
      (userSearch.toLowerCase() === 'usuario' && !u.isSeller)
    ), [users, userSearch]
  )

  // Filtrado de libros
  const filteredBooks = useMemo(
    () => books.filter(b =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase())
    ), [books, bookSearch]
  )

  // Alterna rol de vendedor
  const toggleSeller = id => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isSeller: !u.isSeller } : u))
  }

  // Eliminar usuario
  const deleteUser = id => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id))
    }
  }

  // Eliminar libro
  const deleteBook = id => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      setBooks(prev => prev.filter(b => b.id !== id))
    }
  }

  // Iniciar edición de libro
  const handleEditBook = b => {
    setEditingBookId(b.id)
    setEditBookData({ ...b })
    setShowAdd(false)
  }

  // Cambiar datos en edición
  const handleEditBookChange = (field, value) => {
    setEditBookData(prev => ({ ...prev, [field]: value }))
  }

  // Guardar edición
  const handleSaveEdit = () => {
    if (!editBookData.title || !editBookData.author || !editBookData.price) {
      alert('Por favor completa los campos obligatorios: título, autor y precio')
      return
    }
    
    setBooks(prev => prev.map(b => 
      b.id === editingBookId 
        ? { 
            ...editBookData, 
            price: Number(editBookData.price) || 0, 
            stock: Number(editBookData.stock) || 0 
          } 
        : b
    ))
    setEditingBookId(null)
    setEditBookData({})
  }

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingBookId(null)
    setEditBookData({})
  }

  // Capturar imagen de nuevo libro
  const handleNewBookImage = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewBook(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Capturar imagen en edición
  const handleEditBookImage = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        handleEditBookChange('image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Agregar nuevo libro
  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert('Por favor completa los campos obligatorios: título, autor y precio')
      return
    }

    const id = Math.max(...books.map(b => b.id), 0) + 1
    setBooks(prev => [
      ...prev,
      { 
        id, 
        ...newBook, 
        price: Number(newBook.price) || 0, 
        stock: Number(newBook.stock) || 0,
        image: newBook.image || '/imagenes/default-book.jpg'
      }
    ])
    setNewBook({ title: '', author: '', releaseDate: '', price: '', description: '', stock: '', image: '' })
    setShowAdd(false)
  }

  // Función para mostrar formulario de agregar
  const handleShowAddForm = () => {
    setShowAdd(!showAdd)
    setEditingBookId(null)
    setEditBookData({})
  }

  return (
    <>
      <BarraNavegacion />
      <main className="admin-container">
        <div className="admin-options">
          <button 
            className={`admin-option ${tab === 'users' ? 'active' : ''}`} 
            onClick={() => setTab('users')}
          >
            Administrar Usuarios
          </button>
          <button 
            className={`admin-option ${tab === 'books' ? 'active' : ''}`} 
            onClick={() => setTab('books')}
          >
            Administrar Libros
          </button>
        </div>

        <div className="admin-content">
          {tab === 'users' && (
            <div className="users-panel">
              <h2>Gestión de Usuarios</h2>
              <input
                className="search-input"
                placeholder="Buscar por nombre, correo o tipo (vendedor/usuario)"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No se encontraron usuarios que coincidan con la búsqueda
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo Electrónico</th>
                        <th>Tipo de Usuario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td data-label="Nombre">{u.name}</td>
                          <td data-label="Correo">{u.email}</td>
                          <td data-label="Tipo">
                            <span style={{ 
                              color: u.isSeller ? '#28a745' : '#17a2b8',
                              fontWeight: '600'
                            }}>
                              {u.isSeller ? 'Vendedor' : 'Usuario'}
                            </span>
                          </td>
                          <td data-label="Acciones">
                            <button 
                              className="toggle-button" 
                              onClick={() => toggleSeller(u.id)}
                              title={u.isSeller ? 'Cambiar a Usuario' : 'Cambiar a Vendedor'}
                            >
                              {u.isSeller ? 'Hacer Usuario' : 'Hacer Vendedor'}
                            </button>
                            <button 
                              className="delete-button" 
                              onClick={() => deleteUser(u.id)}
                              title="Eliminar Usuario"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'books' && (
            <div className="books-panel">
              <h2>Gestión de Libros</h2>
              
              <div className="books-controls">
                <input
                  className="search-input"
                  placeholder="Buscar por título o autor..."
                  value={bookSearch}
                  onChange={e => setBookSearch(e.target.value)}
                />
                <button 
                  className="add-button" 
                  onClick={handleShowAddForm}
                >
                  {showAdd ? '✕ Cancelar' : '+ Nuevo Libro'}
                </button>
              </div>

              {/* Formulario de edición */}
              {editingBookId && (
                <div className="add-form">
                  <h3 style={{ 
                    gridColumn: '1 / -1', 
                    color: '#ffa500', 
                    marginBottom: '1rem',
                    textAlign: 'center' 
                  }}>
                    Editando Libro
                  </h3>
                  
                  <input
                    placeholder="Título *"
                    value={editBookData.title || ''}
                    onChange={e => handleEditBookChange('title', e.target.value)}
                  />
                  <input
                    placeholder="Autor *"
                    value={editBookData.author || ''}
                    onChange={e => handleEditBookChange('author', e.target.value)}
                  />
                  <input
                    type="date"
                    placeholder="Fecha de publicación"
                    value={editBookData.releaseDate || ''}
                    onChange={e => handleEditBookChange('releaseDate', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Precio *"
                    value={editBookData.price || ''}
                    onChange={e => handleEditBookChange('price', e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editBookData.stock || ''}
                    onChange={e => handleEditBookChange('stock', e.target.value)}
                    min="0"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleEditBookImage}
                  />
                  
                  <textarea
                    placeholder="Descripción del libro"
                    value={editBookData.description || ''}
                    onChange={e => handleEditBookChange('description', e.target.value)}
                  />
                  
                  {editBookData.image && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      <img 
                        src={editBookData.image} 
                        className="table-image-preview" 
                        alt="Vista previa" 
                      />
                    </div>
                  )}
                  
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="save-button" onClick={handleSaveEdit}>
                      💾 Guardar Cambios
                    </button>
                    <button className="delete-button" onClick={handleCancelEdit}>
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario de creación */}
              {showAdd && !editingBookId && (
                <div className="add-form">
                  <h3 style={{ 
                    gridColumn: '1 / -1', 
                    color: '#ffa500', 
                    marginBottom: '1rem',
                    textAlign: 'center' 
                  }}>
                    Agregar Nuevo Libro
                  </h3>
                  
                  <input
                    placeholder="Título *"
                    value={newBook.title}
                    onChange={e => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <input
                    placeholder="Autor *"
                    value={newBook.author}
                    onChange={e => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                  />
                  <input
                    type="date"
                    placeholder="Fecha de publicación"
                    value={newBook.releaseDate}
                    onChange={e => setNewBook(prev => ({ ...prev, releaseDate: e.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Precio *"
                    value={newBook.price}
                    onChange={e => setNewBook(prev => ({ ...prev, price: e.target.value }))}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newBook.stock}
                    onChange={e => setNewBook(prev => ({ ...prev, stock: e.target.value }))}
                    min="0"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleNewBookImage}
                  />
                  
                  <textarea
                    placeholder="Descripción del libro"
                    value={newBook.description}
                    onChange={e => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                  />
                  
                  {newBook.image && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      <img 
                        src={newBook.image} 
                        className="table-image-preview" 
                        alt="Vista previa" 
                      />
                    </div>
                  )}
                  
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="save-button" onClick={handleAddBook}>
                      💾 Guardar Libro
                    </button>
                    <button className="delete-button" onClick={() => setShowAdd(false)}>
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Tabla de libros */}
              {filteredBooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  {bookSearch ? 'No se encontraron libros que coincidan con la búsqueda' : 'No hay libros registrados'}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Fecha</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks
                        .filter(b => b.id !== editingBookId)
                        .map(b => (
                          <tr key={b.id}>
                            <td data-label="Imagen">
                              <img 
                                src={b.image || '/imagenes/default-book.jpg'} 
                                className="table-image" 
                                alt={b.title}
                                onError={(e) => {
                                  e.target.src = '/imagenes/default-book.jpg'
                                }}
                              />
                            </td>
                            <td data-label="Título">
                              <strong>{b.title}</strong>
                            </td>
                            <td data-label="Autor">{b.author}</td>
                            <td data-label="Fecha">
                              {b.releaseDate ? new Date(b.releaseDate).toLocaleDateString('es-ES') : 'No especificada'}
                            </td>
                            <td data-label="Precio">
                              <span style={{ color: '#28a745', fontWeight: '600' }}>
                                ${b.price?.toLocaleString('es-ES') || '0'}
                              </span>
                            </td>
                            <td data-label="Stock">
                              <span style={{ 
                                color: b.stock > 5 ? '#28a745' : b.stock > 0 ? '#ffa500' : '#ff6b6b',
                                fontWeight: '600'
                              }}>
                                {b.stock || 0} unidades
                              </span>
                            </td>
                            <td data-label="Descripción">
                              <div style={{ 
                                maxHeight: '60px', 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {b.description || 'Sin descripción'}
                              </div>
                            </td>
                            <td data-label="Acciones">
                              <button 
                                className="edit-button" 
                                onClick={() => handleEditBook(b)}
                                title="Editar libro"
                              >
                                ✏️ Editar
                              </button>
                              <button 
                                className="delete-button" 
                                onClick={() => deleteBook(b.id)}
                                title="Eliminar libro"
                              >
                                🗑️ Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}