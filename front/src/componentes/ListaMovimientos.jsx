// front/src/componentes/ListaMovimientos.jsx
// Componente que renderiza el historial de movimientos financieros.
// Usa key={mov.id} (nunca el índice del array) para identificar cada elemento del DOM.

import { useState } from 'react';
import './ListaMovimientos.css';

const FORMATO_MONEDA = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

/**
 * @param {Array} movimientos - Lista de movimientos obtenida desde la API
 */
function ListaMovimientos({ movimientos }) {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

const movimientosFiltrados = movimientos
  ? movimientos.filter((mov) => {
      const coincideTipo = filtroTipo === 'todos' ? true : mov.tipo === filtroTipo;
      const coincideTexto = mov.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return coincideTipo && coincideTexto;
    })
  : [];
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="lista">
        <h2 className="lista__titulo">Historial de Movimientos</h2>
        <p className="lista__vacia">Aún no hay movimientos registrados. ¡Agrega el primero!</p>
      </div>
    );
  }

  return (
    <div className="lista">
      <h2 className="lista__titulo">
        Historial de Movimientos
        <span style={{ marginLeft: 8, fontWeight: 400, color: '#7f8c8d', fontSize: 14 }}>
          ({movimientosFiltrados.length})
        </span>
      </h2>

      <div className="lista__filtros" role="group" aria-label="Filtrar movimientos por tipo">
  <button
    type="button"
    className={`lista__filtro-btn ${filtroTipo === 'todos' ? 'activo' : ''}`}
    onClick={() => setFiltroTipo('todos')}
  >
    Todos
  </button>
  <button
    type="button"
    className={`lista__filtro-btn ${filtroTipo === 'ingreso' ? 'activo' : ''}`}
    onClick={() => setFiltroTipo('ingreso')}
  >
    Ingresos
  </button>
  <button
    type="button"
    className={`lista__filtro-btn ${filtroTipo === 'gasto' ? 'activo' : ''}`}
    onClick={() => setFiltroTipo('gasto')}
  >
    Gastos
  </button>
  <input
    type="search"
    placeholder="Buscar por descripción..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="lista__buscador"
  />
</div>

      <ul className="lista__ul">
        {/* key={mov.id}: identificador único del servidor, nunca el índice del array */}
        {movimientosFiltrados.map((mov) => (
          <li key={mov.id} className={`lista__item lista__item--${mov.tipo}`}>
            <span className="lista__descripcion">{mov.descripcion}</span>
            <span className="lista__fecha">{mov.fecha}</span>
            <span className={`lista__monto lista__monto--${mov.tipo}`}>
              {mov.tipo === 'gasto' ? '- ' : '+ '}
              {FORMATO_MONEDA.format(mov.monto)}
            </span>
            <span className={`lista__badge lista__badge--${mov.tipo}`}>
              {mov.tipo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaMovimientos;
