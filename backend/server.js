// Carga las variables de entorno desde un archivo .env
require('dotenv').config();
console.log('ENV cargado:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? '✔️' : '❌',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✔️' : '❌',
  PORT: process.env.PORT
});

// Importa librerías necesarias
const express = require('express');
const cors    = require('cors'); // Permite peticiones desde otros orígenes como el frontend
const morgan  = require('morgan'); // Middleware para logs de las peticiones HTTP
const authRouter = require('./routes/auth'); // Importa las rutas de autenticación
const catalogoRouter = require('./routes/catalogo'); // Importa las rutas del catálogo
const adminRoutes = require('./routes/adminBooks') // Importa las rutas de administración de libros
const cartRoutes = require('./routes/cart');

// Crea una instancia de la app de Express
const app = express();
// Middlewares globales
app.use(cors()); // Habilita CORS (permite que el frontend consuma esta API)
app.use(express.json());
app.use(morgan('dev'));
// Monta el router de autenticación en la ruta base /api/auth
app.use('/api/auth', authRouter);  
app.use('/api/catalogo', catalogoRouter); // Monta el router del catálogo en la ruta base /api/catalog
app.use('/api/admin', adminRoutes); // Monta las rutas de administración de libros
app.use('/api/cart', cartRoutes);

// Ejemplo de ruta de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

// Levanta el servidor en el puerto especificado
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});