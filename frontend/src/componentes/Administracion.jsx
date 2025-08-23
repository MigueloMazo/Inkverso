import React, { useState, useMemo, useEffect } from 'react'
import BarraNavegacion from '../componentes/BarraNavegacion'
import Footer from '../componentes/Footer'
import '../assets/styles/admin.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function Admin() {
  const [tab, setTab] = useState('users') // Estado para alternar entre pestañas: "users" o "books"
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [books, setBooks] = useState([])
  const [bookSearch, setBookSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false) // toggle formulario de "agregar libro"
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [newBook, setNewBook] = useState({
    title: '', 
    author: '', 
    published_date: '', 
    price: '', 
    description: '', 
    stock: '', 
    cover_url: ''
  })
  const [editingBookId, setEditingBookId] = useState(null)
  const [editBookData, setEditBookData] = useState({})

  // EFECTOS 

  useEffect(() => {
    if (tab === 'users') {
      fetchUsers()
    } else if (tab === 'books') {
      fetchBooks()
    }
  }, [tab])

  //USUARIOS
  const fetchUsers = async () => { // Obtener usuarios de la API
    setLoadingUsers(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`)
      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      alert('Error al cargar usuarios. Revisa la conexión.')
    } finally {
      setLoadingUsers(false)
    }
  }

  const updateUserStatus = async (userId, newStatus) => { // Cambiar estado (activo/inactivo) de un usuario
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newStatus })
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      // Actualizar estado local
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_active: newStatus } : u
      ))
      
      alert(`Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`)
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      alert('Error al actualizar el estado del usuario')
    }
  }

  //LIBROS 

  const fetchBooks = async () => {
    setLoadingBooks(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books`)
      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      setBooks(data.books || [])
    } catch (error) {
      console.error('Error al cargar libros:', error)
      alert('Error al cargar libros. Revisa la conexión.')
    } finally {
      setLoadingBooks(false)
    }
  }

  const createBook = async (bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      setBooks(prev => [...prev, data.book])
      return true
    } catch (error) {
      console.error('Error al crear libro:', error)
      alert('Error al crear el libro')
      return false
    }
  }

  // Editar un libro existente
  const updateBook = async (bookId, bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      setBooks(prev => prev.map(b => b.id === bookId ? data.book : b))
      return true
    } catch (error) {
      console.error('Error al actualizar libro:', error)
      alert('Error al actualizar el libro')
      return false
    }
  }

  // Eliminar libro de la BD
  const deleteBookFromDB = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      // Quitamos el libro del estado local
      setBooks(prev => prev.filter(b => b.id !== bookId))
      return true
    } catch (error) {
      console.error('Error al eliminar libro:', error)
      alert('Error al eliminar el libro')
      return false
    }
  }

  //FILTROS

  // Filtrado de usuarios
  const filteredUsers = useMemo(
    () => users.filter(u => {
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase()
      const email = (u.email || '').toLowerCase()
      const searchLower = userSearch.toLowerCase()
      
      return fullName.includes(searchLower) || 
             email.includes(searchLower) ||
             (searchLower === 'activo' && u.is_active) ||
             (searchLower === 'inactivo' && !u.is_active)
    }), 
    [users, userSearch]
  )

  // Filtrado de libros
  const filteredBooks = useMemo(
    () => books.filter(b =>
      (b.title || '').toLowerCase().includes(bookSearch.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(bookSearch.toLowerCase())
    ), 
    [books, bookSearch]
  )

  // MANEJADORES - USUARIOS

  // Alternar estado activo/inactivo del usuario
  const toggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    const action = user.is_active ? 'desactivar' : 'activar'
    if (window.confirm(`¿Estás seguro de que quieres ${action} este usuario?`)) {
      updateUserStatus(userId, !user.is_active)
    }
  }

  //MANEJADORES - LIBROS 

  // Eliminar libro
  const deleteBook = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      deleteBookFromDB(id)
    }
  }

  // Iniciar edición de libro
  const handleEditBook = (book) => {
    setEditingBookId(book.id)
    setEditBookData({ 
      ...book,
      // Asegurar formato correcto de fecha
      published_date: book.published_date ? book.published_date.split('T')[0] : ''
    })
    setShowAdd(false)
  }

  // Cambiar datos en edición
  const handleEditBookChange = (field, value) => {
    setEditBookData(prev => ({ ...prev, [field]: value }))
  }

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editBookData.title || !editBookData.author || !editBookData.price) {
      alert('Por favor completa los campos obligatorios: título, autor y precio')
      return
    }
    
    const bookToUpdate = {
      title: editBookData.title,
      author: editBookData.author,
      published_date: editBookData.published_date || null,
      price: Number(editBookData.price) || 0,
      stock: Number(editBookData.stock) || 0,
      description: editBookData.description || '',
      cover_url: editBookData.cover_url || ''
    }

    const success = await updateBook(editingBookId, bookToUpdate)
    if (success) {
      setEditingBookId(null)
      setEditBookData({})
    }
  }

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingBookId(null)
    setEditBookData({})
  }

  // Capturar imagen de nuevo libro
  const handleNewBookImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewBook(prev => ({ ...prev, cover_url: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Capturar imagen en edición
  const handleEditBookImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        handleEditBookChange('cover_url', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Agregar nuevo libro
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert('Por favor completa los campos obligatorios: título, autor y precio')
      return
    }

    const bookToCreate = {
      title: newBook.title,
      author: newBook.author,
      published_date: newBook.published_date || null,
      price: Number(newBook.price) || 0,
      stock: Number(newBook.stock) || 0,
      description: newBook.description || '',
      cover_url: newBook.cover_url || ''
    }

    const success = await createBook(bookToCreate)
    if (success) {
      setNewBook({ 
        title: '', 
        author: '', 
        published_date: '', 
        price: '', 
        description: '', 
        stock: '', 
        cover_url: '' 
      })
      setShowAdd(false)
    }
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
                placeholder="Buscar por nombre, correo o estado (activo/inactivo)"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              
              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  Cargando usuarios...
                </div>
              ) : filteredUsers.length === 0 ? (
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
                        <th>Estado</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td data-label="Nombre">
                            {`${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Sin nombre'}
                          </td>
                          <td data-label="Correo">{u.email || 'Sin email'}</td>
                          <td data-label="Estado">
                            <span style={{ 
                              color: u.is_active ? '#28a745' : '#dc3545',
                              fontWeight: '600'
                            }}>
                              {u.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td data-label="Fecha de Registro">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                          </td>
                          <td data-label="Acciones">
                            <button 
                              className="toggle-button" 
                              onClick={() => toggleUserStatus(u.id)}
                              title={u.is_active ? 'Desactivar Usuario' : 'Activar Usuario'}
                            >
                              {u.is_active ? 'Desactivar' : 'Activar'}
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
                    value={editBookData.published_date || ''}
                    onChange={e => handleEditBookChange('published_date', e.target.value)}
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
                  
                  {editBookData.cover_url && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      <img 
                        src={editBookData.cover_url} 
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
                    value={newBook.published_date}
                    onChange={e => setNewBook(prev => ({ ...prev, published_date: e.target.value }))}
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
                  
                  {newBook.cover_url && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      <img 
                        src={newBook.cover_url} 
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
              {loadingBooks ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  Cargando libros...
                </div>
              ) : filteredBooks.length === 0 ? (
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
                        <th>Rating</th>
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
                                src={b.cover_url || '/imagenes/default-book.jpg'} 
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
                              {b.published_date ? new Date(b.published_date).toLocaleDateString('es-ES') : 'No especificada'}
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
                            <td data-label="Rating">
                              <span style={{ color: '#ffa500', fontWeight: '600' }}>
                                {b.rating ? `⭐ ${b.rating}` : 'Sin rating'}
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