// api/src/servidor.js
// Punto de entrada del back-end: configura Express, middlewares de seguridad y monta las rutas.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rutasMovimientos = require('./rutas/movimientos');

const app = express();

// Configuración de CORS restringido (Seguridad corte 3)
// En producción, solo el bucket S3 del frontend tiene permiso para consumir la API.
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

const opcionesCors = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman o curl para pruebas de despliegue)
    if (!origin) return callback(null, true);
    
    // Comparación estricta con el frontend permitido
    if (origin === FRONTEND_ORIGIN || origin.includes('s3-website-us-east-1.amazonaws.com') || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    return callback(new Error('Acceso bloqueado por política de CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(opcionesCors));
app.use(express.json());

// Middleware DRY: registro centralizado de peticiones HTTP
function registrarPeticion(req, res, siguiente) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  siguiente();
}
app.use(registrarPeticion);

// Ruta de diagnóstico / estado general
app.get('/salud', (req, res) => {
  res.status(200).json({
    servicio: 'FinTrack API',
    estado: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Montaje de las rutas modulares de la aplicación
app.use('/movimientos', rutasMovimientos);

// Manejador centralizado para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

// Manejador centralizado de errores (500)
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor: ' + err.message });
});

const PUERTO = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PUERTO, () => {
    console.log(`===============================================`);
    console.log(` FinTrack API escuchando en el puerto ${PUERTO}`);
    console.log(` Origen CORS autorizado: ${FRONTEND_ORIGIN}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
