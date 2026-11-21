// api/src/datos/repositorio.js
// Capa de datos: gestiona la persistencia de movimientos en memoria.

let movimientos = [
  {
    id: 1,
    descripcion: 'Pago de nómina quincenal',
    monto: 1500000,
    tipo: 'ingreso',
    fecha: '2026-11-01'
  },
  {
    id: 2,
    descripcion: 'Servicio de Internet y telefonía',
    monto: 120000,
    tipo: 'gasto',
    fecha: '2026-11-05'
  },
  {
    id: 3,
    descripcion: 'Compra de víveres supermercado',
    monto: 350000,
    tipo: 'gasto',
    fecha: '2026-11-10'
  }
];

function obtenerTodos() {
  return [...movimientos];
}

function obtenerPorId(id) {
  return movimientos.find(m => m.id === Number(id));
}

function guardar(movimiento) {
  const nuevo = {
    id: Date.now(),
    descripcion: movimiento.descripcion.trim(),
    monto: Number(movimiento.monto),
    tipo: movimiento.tipo.toLowerCase(),
    fecha: movimiento.fecha || new Date().toISOString().split('T')[0]
  };
  movimientos.push(nuevo);
  return nuevo;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  guardar
};
