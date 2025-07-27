// Importe librerías 
const express  = require('express'); // Framework web para manejar rutas y solicitudes
const bcrypt   = require('bcrypt'); 
const jwt      = require('jsonwebtoken');
const supabase = require('../config/db'); // Conexión a la base de datos de Supabase

//router de Express para manejar las rutas de autenticación
const router = express.Router();

/**
 * POST /api/auth/register
 * Crea un nuevo usuario en Supabase y devuelve un JWT
 */
router.post('/register', async (req, res) => {
  try {
    // Se extraen los datos enviados desde el frontend
    const { first_name, last_name, email, password } = req.body;

    // Validación básica
    if (!first_name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'first_name, email y password son requeridos.' });
    }

    //Hashear la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    //Insertar en la tabla "users"
    const { data, error } = await supabase
      .from('users')
      .insert([{ first_name, last_name, email, password_hash }])
      .select(); //Retorna la fila creada

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    //Elimina el password_hash para no devolverlo al frontend
    const user = data[0];
    delete user.password_hash;

    //Generar el JWT con id y email
    const payload = { sub: user.id, email: user.email };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    //Devolver usuario y token
    res.status(201).json({ user, token });

  } catch (err) {
    console.error('🔥 Register error ▶', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * POST /api/auth/login
 * Autentica un usuario y devuelve un JWT
 */
router.post('/login', async (req, res) => {
  try {
    //Se extraen las credenciales
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email y password son requeridos.' });
    }

    //Buscar el usuario por email
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1); // Solo el primero, por si acaso

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }
    if (!users.length) { // Si no se encuentra ningún usuario con ese email
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = users[0];

    //Verificar la contraseña (hasheada)
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Se quita el password_hash antes de devolver el usuario
    delete user.password_hash;

    //Generar el JWT
    const payload = { sub: user.id, email: user.email };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    //Devolver usuario y token
    res.json({ user, token });

  } catch (err) {
    console.error('🔥 Login error ▶', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Simular almacenamiento temporal del código (en memoria)
const codes = {}

// Ruta para enviar código de recuperación
router.post('/send-reset-code', async (req, res) => {
  const { email } = req.body

  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(400).json({ error: 'Usuario no encontrado.' })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  codes[email] = code

  console.log(`📨 Código de recuperación para ${email}: ${code}`)

  return res.json({ message: 'Código enviado al correo. (simulado en consola)' })
})

// Ruta para cambiar la contraseña
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body

  if (codes[email] !== code) {
    return res.status(400).json({ error: 'Código incorrecto.' })
  }

  const password_hash = await bcrypt.hash(newPassword, 10)

  const { error } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('email', email)

  if (error) {
    return res.status(500).json({ error: 'No se pudo actualizar la contraseña.' })
  }

  // Limpieza del código
  delete codes[email]

  return res.json({ message: 'Contraseña actualizada con éxito.' })
})

module.exports = router; //Exportamos el router para usarlo en server.js
