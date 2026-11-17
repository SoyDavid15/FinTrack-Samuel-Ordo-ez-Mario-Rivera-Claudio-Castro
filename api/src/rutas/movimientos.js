// api/src/rutas/movimientos.js
// Capa de rutas HTTP: solo recibe peticiones, invoca la lógica/datos y responde.

const express = require('express');
const router = express.Router();
const repositorio = require('../datos/repositorio');
const { validarMovimiento, calcularResumen } = require('../logica/reglas-finanzas');

/**
 * Función auxiliar para estandarizar respuestas HTTP (Principio DRY en backend).
 * Evita repetir res.status(...).json(...) en cada endpoint.
 */
function responder(res, codigo, datos) {
  return res.status(codigo).json(datos);
}

// 1. Ruta que lista: devuelve todos los movimientos registrados
router.get('/', (req, res) => {
  const movimientos = repositorio.obtenerTodos();
  return responder(res, 200, movimientos);
});

// 2. Ruta calculada: devuelve el resumen financiero consolidado
router.get('/resumen', (req, res) => {
  const movimientos = repositorio.obtenerTodos();
  const resumen = calcularResumen(movimientos);
  return responder(res, 200, resumen);
});

// 3. Ruta que recibe datos (POST): valida la entrada y persiste
router.post('/', (req, res) => {
  const validacion = validarMovimiento(req.body);

  if (!validacion.esValido) {
    // Seguridad y buenas prácticas: validación en servidor con mensaje claro y código 400
    return responder(res, 400, {
      error: validacion.error
    });
  }

  const nuevoMovimiento = repositorio.guardar(req.body);
  return responder(res, 201, nuevoMovimiento);
});

module.exports = router;
