// api/src/logica/reglas-finanzas.test.js
// Pruebas unitarias de las reglas de negocio con Vitest.
// Al estar desacopladas de HTTP (sin req ni res), se ejecutan en milisegundos sin levantar el servidor.

import { describe, it, expect } from 'vitest';
import {
  validarMovimiento,
  calcularSaldo,
  determinarEstadoFinanciero,
  calcularResumen,
  MONTO_MINIMO
} from './reglas-finanzas';

describe('validarMovimiento', () => {
  it('aprueba un movimiento con todos los campos válidos', () => {
    const movimientoValido = {
      descripcion: 'Venta de consultoría',
      monto: 250000,
      tipo: 'ingreso'
    };
    const resultado = validarMovimiento(movimientoValido);
    expect(resultado.esValido).toBe(true);
    expect(resultado.error).toBeNull();
  });

  it('rechaza una descripción vacía o compuesta solo de espacios', () => {
    const movimientoInvalido = {
      descripcion: '   ',
      monto: 10000,
      tipo: 'gasto'
    };
    const resultado = validarMovimiento(movimientoInvalido);
    expect(resultado.esValido).toBe(false);
    expect(resultado.error).toContain('descripción es obligatoria');
  });

  // Caso límite: validación de frontera de monto
  it('rechaza un monto inferior al umbral mínimo permitido', () => {
    const movimientoMontoInvalido = {
      descripcion: 'Compra dulce',
      monto: 0, // Umbral inferior al MONTO_MINIMO (0.01)
      tipo: 'gasto'
    };
    const resultado = validarMovimiento(movimientoMontoInvalido);
    expect(resultado.esValido).toBe(false);
    expect(resultado.error).toContain(`mayor o igual a ${MONTO_MINIMO}`);
  });

  it('rechaza tipos de movimiento no reconocidos en el sistema', () => {
    const movimientoTipoInvalido = {
      descripcion: 'Transferencia externa',
      monto: 50000,
      tipo: 'inversion' // Tipo no perteneciente a ['ingreso', 'gasto']
    };
    const resultado = validarMovimiento(movimientoTipoInvalido);
    expect(resultado.esValido).toBe(false);
    expect(resultado.error).toContain('tipo de movimiento es inválido');
  });
});

describe('calcularSaldo', () => {
  it('calcula la diferencia neta exacta entre ingresos y gastos', () => {
    expect(calcularSaldo(1000000, 400000)).toBe(600000);
  });

  it('calcula un saldo negativo cuando los gastos superan los ingresos', () => {
    expect(calcularSaldo(200000, 500000)).toBe(-300000);
  });
});

describe('determinarEstadoFinanciero', () => {
  it('clasifica saldo estrictamente positivo como SUPERAVIT', () => {
    expect(determinarEstadoFinanciero(150000)).toBe('SUPERAVIT');
  });

  // Caso límite: valor exacto de la frontera (0)
  it('clasifica saldo exactamente en cero como EQUILIBRADO', () => {
    expect(determinarEstadoFinanciero(0)).toBe('EQUILIBRADO');
  });

  it('clasifica saldo inferior a cero como DEFICIT', () => {
    expect(determinarEstadoFinanciero(-1)).toBe('DEFICIT');
  });
});

describe('calcularResumen', () => {
  // Caso límite: lista de movimientos vacía
  it('maneja una lista vacía sin arrojar error y devuelve valores en cero', () => {
    const resumen = calcularResumen([]);
    expect(resumen).toEqual({
      totalIngresos: 0,
      totalGastos: 0,
      saldo: 0,
      totalMovimientos: 0,
      estado: 'EQUILIBRADO'
    });
  });

  it('calcula correctamente los acumulados y el estado final de una lista de movimientos', () => {
    const lista = [
      { id: 1, descripcion: 'Sueldo', monto: 1000, tipo: 'ingreso' },
      { id: 2, descripcion: 'Bono', monto: 500, tipo: 'ingreso' },
      { id: 3, descripcion: 'Alquiler', monto: 800, tipo: 'gasto' },
      { id: 4, descripcion: 'Comida', monto: 200, tipo: 'gasto' }
    ];

    const resumen = calcularResumen(lista);
    expect(resumen.totalIngresos).toBe(1500);
    expect(resumen.totalGastos).toBe(1000);
    expect(resumen.saldo).toBe(500);
    expect(resumen.totalMovimientos).toBe(4);
    expect(resumen.estado).toBe('SUPERAVIT');
  });
});
