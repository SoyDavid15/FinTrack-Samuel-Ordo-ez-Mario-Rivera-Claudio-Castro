// api/src/logica/reglas-finanzas.js
// Capa de lógica de negocio pura: NO menciona req ni res.
// Esta capa no sabe que existe HTTP, permitiendo probarla de forma aislada.

// Constantes con nombre para evitar números mágicos (DRY y mantenibilidad)
const MONTO_MINIMO = 0.01;
const TIPOS_VALIDOS = Object.freeze(['ingreso', 'gasto']);
const SALDO_MINIMO_EQUILIBRIO = 0;

/**
 * Valida los datos de entrada para la creación de un nuevo movimiento.
 * @param {Object} datos - Datos del movimiento (descripcion, monto, tipo)
 * @returns {{ esValido: boolean, error: string | null }}
 */
function validarMovimiento(datos) {
  if (!datos || typeof datos !== 'object') {
    return { esValido: false, error: 'El cuerpo de la solicitud no puede estar vacío.' };
  }

  const { descripcion, monto, tipo } = datos;

  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
    return { esValido: false, error: 'La descripción es obligatoria y no puede estar vacía.' };
  }

  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return { esValido: false, error: 'El monto debe ser un número válido.' };
  }

  const montoNumerico = Number(monto);
  if (montoNumerico < MONTO_MINIMO) {
    return { esValido: false, error: `El monto debe ser mayor o igual a ${MONTO_MINIMO}.` };
  }

  if (!tipo || typeof tipo !== 'string' || !TIPOS_VALIDOS.includes(tipo.toLowerCase())) {
    return {
      esValido: false,
      error: `El tipo de movimiento es inválido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`
    };
  }

  return { esValido: true, error: null };
}

/**
 * Suma los ingresos o gastos de una lista según el tipo indicado.
 * @param {Array} movimientos 
 * @param {string} tipo - 'ingreso' o 'gasto'
 * @returns {number}
 */
function sumarPorTipo(movimientos, tipo) {
  if (!Array.isArray(movimientos) || movimientos.length === 0) {
    return 0;
  }
  return movimientos
    .filter(m => m.tipo && m.tipo.toLowerCase() === tipo)
    .reduce((acumulado, m) => acumulado + Number(m.monto || 0), 0);
}

/**
 * Calcula el saldo neto a partir de los ingresos y los gastos.
 * @param {number} totalIngresos 
 * @param {number} totalGastos 
 * @returns {number}
 */
function calcularSaldo(totalIngresos, totalGastos) {
  return Number(totalIngresos || 0) - Number(totalGastos || 0);
}

/**
 * Determina el estado de la cuenta según el saldo.
 * La regla de negocio vive aquí en el back; el front solo la muestra (DRY).
 * @param {number} saldo 
 * @returns {string} 'SUPERAVIT' | 'EQUILIBRADO' | 'DEFICIT'
 */
function determinarEstadoFinanciero(saldo) {
  if (saldo > SALDO_MINIMO_EQUILIBRIO) {
    return 'SUPERAVIT';
  }
  if (saldo === SALDO_MINIMO_EQUILIBRIO) {
    return 'EQUILIBRADO';
  }
  return 'DEFICIT';
}

/**
 * Genera el resumen financiero consolidado para una lista de movimientos.
 * @param {Array} movimientos 
 * @returns {Object}
 */
function calcularResumen(movimientos) {
  const lista = Array.isArray(movimientos) ? movimientos : [];
  const totalIngresos = sumarPorTipo(lista, 'ingreso');
  const totalGastos = sumarPorTipo(lista, 'gasto');
  const saldo = calcularSaldo(totalIngresos, totalGastos);
  const estado = determinarEstadoFinanciero(saldo);

  return {
    totalIngresos,
    totalGastos,
    saldo,
    totalMovimientos: lista.length,
    estado
  };
}

module.exports = {
  MONTO_MINIMO,
  TIPOS_VALIDOS,
  SALDO_MINIMO_EQUILIBRIO,
  validarMovimiento,
  sumarPorTipo,
  calcularSaldo,
  determinarEstadoFinanciero,
  calcularResumen
};
