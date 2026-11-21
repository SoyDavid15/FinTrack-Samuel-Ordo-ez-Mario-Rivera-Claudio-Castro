// front/src/api.js
// Módulo centralizado para consumir la API de FinTrack (Principio DRY en frontend).
// Toda llamada HTTP pasa por aquí, evitando repetir la URL base en cada componente.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper interno de fetch con manejo de errores HTTP centralizado.
 * @param {string} ruta - Endpoint relativo (ej. '/movimientos')
 * @param {Object} opciones - Opciones nativas de fetch (method, body, headers)
 * @returns {Promise<any>} - Datos JSON de la respuesta
 */
async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor: ${respuesta.status}`);
  }

  return respuesta.json();
}

export async function obtenerMovimientos() {
  return peticion('/movimientos');
}

export async function obtenerResumen() {
  return peticion('/movimientos/resumen');
}

export async function crearMovimiento(datos) {
  return peticion('/movimientos', {
    method: 'POST',
    body: JSON.stringify(datos)
  });
}
