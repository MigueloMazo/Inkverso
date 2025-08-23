const express = require('express')
const supabase = require('../config/db')
const router = express.Router()

// GET /api/catalog
router.get('/', async (req, res) => {
  try {
    // Obtener todos los libros
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')

    if (booksError) {
      console.error('📚 Error al obtener libros:', booksError.message)
      return res.status(500).json({ error: 'Error al obtener libros' })
    }

    // Obtener todos los comentarios con book_id y rating
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('book_id, rating')

    if (commentsError) {
      console.error('💬 Error al obtener comentarios:', commentsError.message)
      return res.status(500).json({ error: 'Error al obtener comentarios' })
    }

    // Agrupar calificaciones por book_id
    const ratingMap = {}
    comments.forEach(({ book_id, rating }) => {
      if (!ratingMap[book_id]) ratingMap[book_id] = []
      ratingMap[book_id].push(rating)
    })

    // Añadir promedio de calificación a cada libro
    const booksWithRatings = books.map(book => {
      const ratings = ratingMap[book.id] || []
      const avgRating = ratings.length
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : null
      return {
        ...book,
        rating: avgRating ? parseFloat(avgRating) : null
      }
    })

    res.json({ books: booksWithRatings })
  } catch (err) {
    console.error('🔥 Error interno ▶', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


// Obtener un libro por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Libro no encontrado' })
  }

  res.json(data)
})

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params
  const { user_name, rating, text } = req.body

  if (!user_name || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Datos inválidos' })
  }

  const { error } = await supabase.from('comments').insert({
    book_id: id,
    user_name,
    rating,
    text
  })

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ message: 'Comentario registrado' })
})

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('comments')
    .select('user_name, rating, text, created_at')
    .eq('book_id', id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})


module.exports = router