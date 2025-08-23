const express = require('express')
const router = express.Router()
const supabase = require('../config/db'); 

// LIBROS

// GET /api/admin/books  // Obtener todos los libros con su rating promedio
router.get('/books', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`*, comments(rating)`)

    if (error) throw error

    const books = data.map(book => { // Calcular el promedio de ratings por libro
      const ratings = book.comments?.map(c => c.rating) || []
      const avgRating = ratings.length
        ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : null

      return {
        ...book,
        rating: avgRating // Se agrega el rating promedio al objeto libro
      }
    })

    res.json({ books })
  } catch (err) {
    console.error('❌ Error al obtener libros:', err.message)
    res.status(500).json({ error: 'Error al obtener libros desde admin' })
  }
})

// POST /api/admin/books //Agregar un nuevo libro
router.post('/books', async (req, res) => {
  const { title, author, published_date, price, stock, description, cover_url } = req.body

  try {
    const { data, error } = await supabase
      .from('books')
      .insert([{ title, author, published_date, price, stock, description, cover_url }])
      .select() // Retorna el registro insertado

    if (error) throw error

    res.status(201).json({ book: data[0] }) // Devuelve el libro creado
  } catch (err) {
    console.error('❌ Error al agregar libro:', err.message)
    res.status(500).json({ error: 'Error al agregar libro' })
  }
})

// PUT /api/admin/books/:id //Actualizar un libro existente
router.put('/books/:id', async (req, res) => {
  const bookId = req.params.id
  const updates = req.body

  try {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', bookId)
      .select()

    if (error) throw error

    res.json({ book: data[0] }) // Devuelve el libro actualizado
  } catch (err) {
    console.error('❌ Error al actualizar libro:', err.message)
    res.status(500).json({ error: 'Error al actualizar libro' })
  }
})
 
// DELETE /api/admin/books/:id //Eliminar un libro por ID
router.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id

  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)

    if (error) throw error

    res.status(204).send() // Respuesta sin contenido (204 = borrado exitoso)
  } catch (err) {
    console.error('❌ Error al eliminar libro:', err.message)
    res.status(500).json({ error: 'Error al eliminar libro' })
  }
})

//USUARIOS

// GET /api/admin/users //Obtener lista de usuarios
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, is_active, created_at') // Trae solo ciertos campos

    if (error) {
      console.error('❌ Error al obtener usuarios:', error.message)
      return res.status(500).json({ error: 'Error al obtener usuarios' })
    }

    res.json({ users: data }) // Devuelve los usuarios
  } catch (err) {
    console.error('🔥 Error interno ▶', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// PUT /api/admin/users/:id/estado //Activar/Desactivar un usuario
router.put('/users/:id/estado', async (req, res) => {
  const { id } = req.params
  const { is_active } = req.body

  try {
    const { error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', id)

    if (error) {
      console.error('❌ Error al actualizar estado del usuario:', error.message)
      return res.status(500).json({ error: 'Error al actualizar estado del usuario' })
    }

    res.json({ message: 'Estado actualizado correctamente' })
  } catch (err) {
    console.error('🔥 Error interno ▶', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router // Exporta el router para usarlo en server.js
